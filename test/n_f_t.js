const NFT = artifacts.require("NFT");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NFT", function (/* accounts */) {
  it("should assert true", async function () {
    await NFT.deployed();
    return assert.isTrue(true);
  });


  it("should deploy the NFT contract with a name", async function () {

    const nftInstance = await NFT.new("Collection");

    const name = await nftInstance.name();
    assert.equal(name, "Collection", "The NFT name should be 'Collection'");
  });

});
