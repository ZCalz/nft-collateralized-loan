import { NFTContract, NFTInstance } from "../types/truffle-contracts/NFT";

// usage: npx truffle exec scripts/mint-nft.ts --network <network> <receipient-address>
// replace the <network> witht he network name and <receipient-address> with the address of the receipient

module.exports = async function (callback: any) {
  try {
    const args = process.argv.slice(4);
    if (args.length !== 3) {
        console.log("Arguments passed:", args);
        throw new Error("Missing Arguments")
    }
    const [,,receiver] = args

    const NFT: NFTContract = artifacts.require("NFT");

    const instance: NFTInstance = await NFT.deployed();
    const contractName = await instance.name();
    console.log("Contract Name:", contractName.toString());

    const nftTokenId: BN = await instance.nextTokenId();
    await instance.mint(receiver);

    console.log(`Token id ${nftTokenId} minted to ${receiver}`);

    const ownerBalance: BN = await instance.balanceOf(receiver);

    console.log(`${receiver} owns ${ownerBalance} NFTs from this collection`);

    callback();
  } catch (error) {
    console.error("Error executing script:", error);
    callback(error);
  }
};
