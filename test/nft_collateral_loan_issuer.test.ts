
import { LoanTokenContract, LoanTokenInstance } from '../types/truffle-contracts/LoanToken';
import { AllEvents, NFTContract, NFTInstance } from '../types/truffle-contracts/NFT';
import { NFTCollateralLoanIssuerContract, NFTCollateralLoanIssuerInstance } from '../types/truffle-contracts/NFTCollateralLoanIssuer';


const NFTCollateralLoanIssuer: NFTCollateralLoanIssuerContract = artifacts.require("NFTCollateralLoanIssuer");
const NFT: NFTContract = artifacts.require("NFT");
const LoanToken: LoanTokenContract = artifacts.require("LoanToken");
const truffleAssert = require('truffle-assertions');

contract("NFTCollateralLoanIssuer", (accounts) => {
  const [owner, borrower, nonBorrower] = accounts;

  let nftCollateralLoanIssuer: NFTCollateralLoanIssuerInstance;
  let nft: NFTInstance;
  let loanToken: LoanTokenInstance;
  let nftTokenId: string;
  const loanAmount = web3.utils.toWei('100', 'ether'); // 100 ERC20 tokens

  before(async () => {
    // Deploy NFT and LoanToken contracts
    nft = await NFT.new();
    loanToken = await LoanToken.new(web3.utils.toWei('1000', 'ether')); // Initial supply of 1000 tokens

    // Deploy the NFTCollateralLoanIssuer contract
    nftCollateralLoanIssuer = await NFTCollateralLoanIssuer.new(loanToken.address);

    // Mint an NFT to the borrower
    const tx: Truffle.TransactionResponse<AllEvents> = await nft.mint(borrower);

    // Extract the token ID from the transaction receipt
    nftTokenId = tx.logs[0].args[0].toString();
    
    // Verify the token ID
    assert.ok(nftTokenId, "Token ID should be obtained");
    
    // Transfer some Loan tokens to the loan contract so it can issue loans
    await loanToken.transfer(nftCollateralLoanIssuer.address, loanAmount, { from: owner });
  });

  it("should not allow collateralization if there are not enough tokens available for loan", async () => {
    const excessiveLoanAmount = web3.utils.toWei('1000', 'ether');

    // Approve the NFTCollateralLoanIssuer contract to transfer the borrower's NFT
    await nft.approve(nftCollateralLoanIssuer.address, nftTokenId, { from: borrower });

    // Attempt to collateralize the NFT (should fail due to insufficient tokens)
    await truffleAssert.fails(
      nftCollateralLoanIssuer.collateralizeNFT(nft.address, nftTokenId, excessiveLoanAmount, { from: borrower }),
      truffleAssert.ErrorType.REVERT,
      "Not enough tokens available to create a loan"
    );
  });

  it("should allow the borrower to collateralize an NFT and receive a loan", async () => {
    // Approve the NFTCollateralLoanIssuer contract to transfer the borrower's NFT
    await nft.approve(nftCollateralLoanIssuer.address, nftTokenId, { from: borrower });

    // Collateralize the NFT and receive the loan
    await nftCollateralLoanIssuer.collateralizeNFT(nft.address, nftTokenId, loanAmount, { from: borrower });

    // Check that the loan contract now owns the NFT
    const newOwner: string = await nft.ownerOf(nftTokenId);
    assert.strictEqual(newOwner, nftCollateralLoanIssuer.address, "The NFT should be owned by the loan contract");

    // Check that the borrower received the ERC20 loan
    const borrowerBalance = await loanToken.balanceOf(borrower);
    assert.strictEqual(borrowerBalance.toString(), loanAmount.toString(), "The borrower should have received the loan amount");
  });

  it("should not allow non-owners to repay the loan", async () => {
    // Attempt to repay the loan from a non-borrower account
    await truffleAssert.fails(
      nftCollateralLoanIssuer.repayLoan(nft.address, nftTokenId, { from: nonBorrower }),
      truffleAssert.ErrorType.REVERT,
      "Only the borrower can repay the loan"
    );
  });

  it("should allow the borrower to repay the loan and retrieve the NFT", async () => {
    // Approve the loan contract to spend the borrower's ERC20 tokens
    await loanToken.approve(nftCollateralLoanIssuer.address, loanAmount, { from: borrower });

    // Repay the loan
    await nftCollateralLoanIssuer.repayLoan(nft.address, nftTokenId, { from: borrower });

    // Check that the borrower regained ownership of the NFT
    const newOwner: string = await nft.ownerOf(nftTokenId);
    assert.strictEqual(newOwner, borrower, "The borrower should have regained ownership of the NFT");

    // Check that the loan contract has received the loan repayment
    const loanContractBalance = await loanToken.balanceOf(nftCollateralLoanIssuer.address);
    assert.strictEqual(loanContractBalance.toString(), loanAmount.toString(), "The loan contract should have received the loan repayment");
  });

  it("should allow the owner to liquidate the NFT if the loan is not repaid", async () => {
    // Mint a new NFT to the borrower
    const tx: Truffle.TransactionResponse<AllEvents> = await nft.mint(borrower);

    // Extract the token ID from the transaction receipt
    const newNftTokenId: string = tx.logs[0].args[0].toString();
    
    // Verify the token ID
    assert.ok(nftTokenId, "Token ID should be obtained");

    // Approve and collateralize the new NFT
    await nft.approve(nftCollateralLoanIssuer.address, newNftTokenId, { from: borrower });
    await nftCollateralLoanIssuer.collateralizeNFT(nft.address, newNftTokenId, loanAmount, { from: borrower });

    // Liquidate the NFT (assuming the loan is not repaid)
    await nftCollateralLoanIssuer.liquidateNFT(nft.address, newNftTokenId, { from: owner });

    // Check that the contract owner now owns the NFT
    const newOwner: string = await nft.ownerOf(newNftTokenId);
    assert.strictEqual(newOwner, owner, "The contract owner should have received the liquidated NFT");
  });
});