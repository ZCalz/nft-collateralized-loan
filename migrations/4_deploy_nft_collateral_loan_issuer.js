const LoanToken = artifacts.require("LoanToken");
const NFTCollateralLoanIssuer = artifacts.require("NFTCollateralLoanIssuer");

module.exports = async function (deployer) {
  // Retrieve the deployed LoanToken instance
  const loanTokenInstance = await LoanToken.deployed();

  // Get the LoanToken contract address
  const loanTokenAddress = loanTokenInstance.address;

  // Deploy the NFTCollateralLoanIssuer contract with the LoanToken address
  await deployer.deploy(NFTCollateralLoanIssuer, loanTokenAddress);
};