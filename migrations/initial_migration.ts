import { MigrationsContract } from '../types/truffle-contracts/Migrations';

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
  ) => {
    const Migrations: MigrationsContract = artifacts.require("Migrations");
    deployer.deploy(Migrations);
  };
};
