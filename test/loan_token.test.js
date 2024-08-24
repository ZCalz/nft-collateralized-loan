const LoanToken = artifacts.require("LoanToken");
const assert = require('assert');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

contract("LoanToken", async (accounts) => {
  const [deployer, recipient] = accounts;
  const initialSupply = web3.utils.toBN('1000000'); // 1 million tokens with 18 decimals

  let loanToken;

  beforeEach(async () => {
    loanToken = await LoanToken.new(initialSupply);
  });

  it("should have the correct name and symbol", async () => {
    const name = await loanToken.name();
    const symbol = await loanToken.symbol();
    assert.strictEqual(name, "LoanToken");
    assert.strictEqual(symbol, "LTKN");
  });

  it("should mint the initial supply to the deployer", async () => {
    const balance = await loanToken.balanceOf(deployer);
    assert.strictEqual(balance.toString(), initialSupply.mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))).toString());
  });

  it("should transfer tokens correctly", async () => {
    const transferAmount = web3.utils.toBN('1000').mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))); // 1000 tokens
    await loanToken.transfer(recipient, transferAmount, { from: deployer });

    const deployerBalance = await loanToken.balanceOf(deployer);
    const recipientBalance = await loanToken.balanceOf(recipient);

    assert.strictEqual(deployerBalance.toString(), initialSupply.mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))).sub(transferAmount).toString());
    assert.strictEqual(recipientBalance.toString(), transferAmount.toString());
  });

  it("should allow approval and transferFrom", async () => {
    const approveAmount = web3.utils.toBN('500').mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))); // 500 tokens
    await loanToken.approve(recipient, approveAmount, { from: deployer });

    await loanToken.transferFrom(deployer, recipient, approveAmount, { from: recipient });

    const deployerBalance = await loanToken.balanceOf(deployer);
    const recipientBalance = await loanToken.balanceOf(recipient);

    assert.strictEqual(deployerBalance.toString(), initialSupply.mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))).sub(approveAmount).toString());
    assert.strictEqual(recipientBalance.toString(), approveAmount.toString());
  });
});