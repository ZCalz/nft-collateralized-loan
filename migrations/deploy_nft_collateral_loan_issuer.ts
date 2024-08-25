import { LoanTokenContract, LoanTokenInstance } from '../types/truffle-contracts/LoanToken';
import { NFTContract, NFTInstance } from '../types/truffle-contracts/NFT';
import { NFTCollateralLoanIssuerContract, NFTCollateralLoanIssuerInstance } from '../types/truffle-contracts/NFTCollateralLoanIssuer';

import fs from 'fs'
import path from 'path'

type Network = "development" | "kovan" | "mainnet";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
  ) => {

    const LoanToken: LoanTokenContract = artifacts.require("LoanToken");
    const NFT: NFTContract = artifacts.require("NFT");
    const NFTCollateralLoanIssuer: NFTCollateralLoanIssuerContract = artifacts.require("NFTCollateralLoanIssuer");

    // Retrieve the deployed LoanToken instance
    const loanTokenInstance: LoanTokenInstance = await LoanToken.deployed();

    // Get the LoanToken contract address
    const loanTokenAddress = loanTokenInstance.address;

    // Get the NFT contract address
    const nftInstance: NFTInstance = await NFT.deployed();

    // Deploy the NFTCollateralLoanIssuer contract with the LoanToken address
    await deployer.deploy(NFTCollateralLoanIssuer, loanTokenAddress);

    const nftCollateralLoanIssuerInstance: NFTCollateralLoanIssuerInstance =
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
};