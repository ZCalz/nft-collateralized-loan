const fs = require("fs");
const path = require("path");
const LoanToken = artifacts.require("LoanToken");
const NFT = artifacts.require("NFT");
const NFTCollateralLoanIssuer = artifacts.require("NFTCollateralLoanIssuer");

module.exports = async function (deployer, network) {
  // Retrieve the deployed LoanToken instance
  const loanTokenInstance = await LoanToken.deployed();

  // Get the LoanToken contract address
  const loanTokenAddress = loanTokenInstance.address;

  // Get the NFT contract address
  const nftInstance = await NFT.deployed();

  // Deploy the NFTCollateralLoanIssuer contract with the LoanToken address
  await deployer.deploy(NFTCollateralLoanIssuer, loanTokenAddress);

  const nftCollateralLoanIssuerInstance =
    await NFTCollateralLoanIssuer.deployed();

  // Save deployed addresses
  const deploymentData = {
    Nft: nftInstance.address,
    LoanToken: loanTokenInstance.address,
    NFTCollateralLoanIssuer: nftCollateralLoanIssuerInstance.address,
  };

  // Create a folder for storing deployment addresses if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployed_addresses");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save the addresses to a JSON file
  const filePath = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(filePath, JSON.stringify(deploymentData, null, 2), "utf-8");

  console.log(`Addresses saved to ${filePath}`);
};
