// migrations/2_deploy_nft.js
const NFT = artifacts.require("NFT");

module.exports = function (deployer) {
  deployer.deploy(NFT, "Collection");
};
