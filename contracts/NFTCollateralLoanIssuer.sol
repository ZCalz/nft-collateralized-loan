// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollateralLoanIssuer is Ownable {
    // ERC20 token used for issuing loans
    IERC20 public loanToken;

    // Structure to keep track of loan details
    struct Loan {
        address borrower;
        uint256 nftTokenId;
        uint256 loanAmount;
        bool isActive;
    }

    // Mapping to track loans by NFT address and token ID
    mapping(address => mapping(uint256 => Loan)) public loans;

    // Events
    event LoanCreated(address indexed borrower, address indexed nftAddress, uint256 indexed tokenId, uint256 loanAmount);
    event LoanRepaid(address indexed borrower, address indexed nftAddress, uint256 indexed tokenId);
    event NFTLiquidated(address indexed nftAddress, uint256 indexed tokenId);

    // Constructor to set the ERC20 token address
    constructor(IERC20 _loanToken) Ownable(msg.sender) {
        loanToken = _loanToken;
    }

    // Function to collateralize an NFT and receive a loan in ERC20 tokens
    function collateralizeNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 loanAmount
    ) external {
        // Ensure the NFT is not already collateralized
        require(!loans[nftAddress][tokenId].isActive, "NFT is already collateralized");

        // Transfer the NFT from the borrower to this contract as collateral
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

        // Create the loan and mark it as active
        loans[nftAddress][tokenId] = Loan({
            borrower: msg.sender,
            nftTokenId: tokenId,
            loanAmount: loanAmount,
            isActive: true
        });

        // Transfer the loan amount in ERC20 tokens to the borrower
        loanToken.transfer(msg.sender, loanAmount);

        emit LoanCreated(msg.sender, nftAddress, tokenId, loanAmount);
    }

    // Function to repay the loan and retrieve the NFT
    function repayLoan(address nftAddress, uint256 tokenId) external {
        Loan memory loan = loans[nftAddress][tokenId];

        require(loan.isActive, "Loan is not active");
        require(msg.sender == loan.borrower, "Only the borrower can repay the loan");

        // Transfer the loan amount back to the contract
        loanToken.transferFrom(msg.sender, address(this), loan.loanAmount);

        // Transfer the NFT back to the borrower
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);

        // Mark the loan as inactive
        loans[nftAddress][tokenId].isActive = false;

        emit LoanRepaid(msg.sender, nftAddress, tokenId);
    }

    // Function for the contract owner to liquidate the NFT if the loan is not repaid
    function liquidateNFT(address nftAddress, uint256 tokenId) external onlyOwner {
        Loan memory loan = loans[nftAddress][tokenId];
        require(loan.isActive, "Loan is not active");

        // Transfer the NFT to the contract owner
        IERC721(nftAddress).transferFrom(address(this), owner(), tokenId);

        // Mark the loan as inactive
        loans[nftAddress][tokenId].isActive = false;

        emit NFTLiquidated(nftAddress, tokenId);
    }
}
