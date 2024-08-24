const LoanToken = artifacts.require("LoanToken");

module.exports = function (deployer) {
  const initialSupply = 1000000; // 1 million tokens
  deployer.deploy(LoanToken, initialSupply);
};
