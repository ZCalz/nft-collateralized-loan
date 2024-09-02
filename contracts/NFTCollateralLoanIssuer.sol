/// This file is auto-generated by Scribble and shouldn't be edited directly.
/// Use --disarm prior to make any changes.
/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollateralLoanIssuer is Ownable {
    event LoanCreated(address indexed borrower, address indexed nftAddress, uint256 indexed tokenId, uint256 loanId, uint256 loanAmount);

    event LoanRepaid(address indexed borrower, address indexed nftAddress, uint256 indexed tokenId, uint256 loanId);

    event NFTLiquidated(address indexed nftAddress, uint256 indexed tokenId, uint256 loanId);

    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 nftTokenId;
        uint256 loanAmount;
        bool isActive;
    }

    IERC20 public loanToken;
    mapping(address => mapping(uint256 => Loan)) public loans;
    uint256 public nextLoanId;

    constructor(IERC20 _loanToken) {
        loanToken = _loanToken;
        nextLoanId = 1;
    }

    function collateralizeNFT(address nftAddress, uint256 tokenId, uint256 loanAmount) external {
        _original_NFTCollateralLoanIssuer_collateralizeNFT(nftAddress, tokenId, loanAmount);
        unchecked {
            if (!(loans[nftAddress][tokenId].isActive == false)) {
                emit __ScribbleUtilsLib__3238.AssertionFailedData(3, abi.encode(nftAddress, tokenId));
                emit __ScribbleUtilsLib__3238.AssertionFailed("001523:0068:001 3: ");
            }
            if (!(loans[nftAddress][tokenId].borrower == msg.sender)) {
                emit __ScribbleUtilsLib__3238.AssertionFailedData(4, abi.encode(nftAddress, tokenId));
                emit __ScribbleUtilsLib__3238.AssertionFailed("001798:0068:001 4: ");
            }
        }
    }

    function _original_NFTCollateralLoanIssuer_collateralizeNFT(address nftAddress, uint256 tokenId, uint256 loanAmount) internal {
        require(!loans[nftAddress][tokenId].isActive, "NFT is already collateralized");
        uint256 contractBalance = loanToken.balanceOf(address(this));
        require(contractBalance >= loanAmount, "Not enough tokens available to create a loan");
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        loans[nftAddress][tokenId] = Loan({loanId: nextLoanId, borrower: msg.sender, nftTokenId: tokenId, loanAmount: loanAmount, isActive: true});
        nextLoanId++;
        loanToken.transfer(msg.sender, loanAmount);
        emit LoanCreated(msg.sender, nftAddress, tokenId, loans[nftAddress][tokenId].loanId, loanAmount);
    }

    function repayLoan(address nftAddress, uint256 tokenId) external {
        _original_NFTCollateralLoanIssuer_repayLoan(nftAddress, tokenId);
        unchecked {
            if (!(loans[nftAddress][tokenId].isActive == false)) {
                emit __ScribbleUtilsLib__3238.AssertionFailedData(5, abi.encode(nftAddress, tokenId));
                emit __ScribbleUtilsLib__3238.AssertionFailed("003049:0068:001 5: ");
            }
            if (!(msg.sender == loans[nftAddress][tokenId].borrower)) {
                emit __ScribbleUtilsLib__3238.AssertionFailedData(6, abi.encode(nftAddress, tokenId));
                emit __ScribbleUtilsLib__3238.AssertionFailed("003324:0068:001 6: ");
            }
        }
    }

    function _original_NFTCollateralLoanIssuer_repayLoan(address nftAddress, uint256 tokenId) internal {
        Loan storage loan = loans[nftAddress][tokenId];
        require(loan.isActive, "Loan is not active");
        require(msg.sender == loan.borrower, "Only the borrower can repay the loan");
        loanToken.transferFrom(msg.sender, address(this), loan.loanAmount);
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);
        loan.isActive = false;
        emit LoanRepaid(msg.sender, nftAddress, tokenId, loan.loanId);
    }

    function liquidateNFT(address nftAddress, uint256 tokenId) external {
        _original_NFTCollateralLoanIssuer_liquidateNFT(nftAddress, tokenId);
        unchecked {
            if (!(loans[nftAddress][tokenId].isActive == false)) {
                emit __ScribbleUtilsLib__3238.AssertionFailedData(7, abi.encode(nftAddress, tokenId));
                emit __ScribbleUtilsLib__3238.AssertionFailed("004346:0068:001 7: ");
            }
        }
    }

    function _original_NFTCollateralLoanIssuer_liquidateNFT(address nftAddress, uint256 tokenId) internal onlyOwner() {
        Loan storage loan = loans[nftAddress][tokenId];
        require(loan.isActive, "Loan is not active");
        IERC721(nftAddress).transferFrom(address(this), owner(), tokenId);
        loan.isActive = false;
        emit NFTLiquidated(nftAddress, tokenId, loan.loanId);
    }
}

library __ScribbleUtilsLib__3238 {
    event AssertionFailed(string message);

    event AssertionFailedData(int eventId, bytes encodingData);

    function assertionFailed(string memory arg_0) internal {
        emit AssertionFailed(arg_0);
    }

    function assertionFailedData(int arg_0, bytes memory arg_1) internal {
        emit AssertionFailedData(arg_0, arg_1);
    }

    function isInContract() internal returns (bool res) {
        assembly {
            res := sload(0x5f0b92cf9616afdee4f4136f66393f1343b027f01be893fa569eb2e2b667a40c)
        }
    }

    function setInContract(bool v) internal {
        assembly {
            sstore(0x5f0b92cf9616afdee4f4136f66393f1343b027f01be893fa569eb2e2b667a40c, v)
        }
    }
}