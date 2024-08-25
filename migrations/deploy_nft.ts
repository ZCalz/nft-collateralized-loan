import { NFTContract } from '../types/truffle-contracts/NFT';

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
  ) => {
    const NFT: NFTContract = artifacts.require("NFT");
    deployer.deploy(NFT);
  };
};
