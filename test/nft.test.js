const NFT = artifacts.require("NFT");
const assert = require('assert');
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NFT", accounts => {
  const [owner, nonOwner] = accounts;
  let nft;

  beforeEach(async () => {
    nft = await NFT.new();
  });

  it("should deploy with the correct name and symbol", async () => {
    const name = await nft.name();
    const symbol = await nft.symbol();
    
    assert.strictEqual(name, "BasicNFT", "Contract name should be BasicNFT");
    assert.strictEqual(symbol, "NFT", "Contract symbol should be NFT");
  });

  it("should mint tokens correctly and increment token IDs", async () => {
    await nft.mint(owner); // Mint the first token
    const ownerBalance = await nft.balanceOf(owner);
    const nextTokenId = await nft.nextTokenId();

    assert.strictEqual(ownerBalance.toString(), '1', "Owner's balance should be 1");
    assert.strictEqual(nextTokenId.toString(), '1', "Next token ID should be 1");

    await nft.mint(owner); // Mint the second token
    const newTokenId = await nft.nextTokenId();
    
    assert.strictEqual(newTokenId.toString(), '2', "Next token ID should be 2");
  });

  it("should set and get base URI correctly", async () => {
    const newURI = "https://new-uri.xyz/";
    await nft.setBaseURI(newURI);
    const baseURI = await nft.baseURI();

    assert.strictEqual(baseURI, newURI, "Base URI should be updated correctly");
  });

  // it("should not allow non-owners to set base URI", async () => {
  //   await truffleAssert.reverts(
  //     nft.setBaseURI("https://malicious-uri.xyz/", { from: nonOwner }),
  //     "Ownable: caller is not the owner"
  //   );
  // });

  it("should return the correct base URI", async () => {
    const initialURI = await nft.baseURI();
    assert.strictEqual(initialURI, "https://tempory-uri.xyz/", "Initial base URI should be correct");
  });
});
