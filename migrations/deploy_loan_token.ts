import { LoanTokenContract } from '../types/truffle-contracts/LoanToken';

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
  ) => {
    const LoanToken: LoanTokenContract = artifacts.require("LoanToken");
    const initialSupply = 1000000; // 1 million tokens
    deployer.deploy(LoanToken, initialSupply);
  };
};
