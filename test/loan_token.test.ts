
import { LoanTokenInstance, LoanTokenContract } from '../types/truffle-contracts/LoanToken';
const LoanToken: LoanTokenContract = artifacts.require("LoanToken");

contract("LoanToken", async (accounts) => {
  const [deployer, recipient] = accounts;
  const initialSupply = web3.utils.toBN('1000000'); // 1 million tokens with 18 decimals

  let loanToken: LoanTokenInstance;

  beforeEach(async () => {
    loanToken = await LoanToken.new(initialSupply);
  });

  it("should have the correct name and symbol", async () => {
    const name: string = await loanToken.name();
    const symbol: string = await loanToken.symbol();
    assert.strictEqual(name, "LoanToken");
    assert.strictEqual(symbol, "LTKN");
  });

  it("should mint the initial supply to the deployer", async () => {
    const balance: BN = await loanToken.balanceOf(deployer);
    assert.strictEqual(balance.toString(), initialSupply.mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))).toString());
  });

  it("should transfer tokens correctly", async () => {
    const transferAmount: BN = web3.utils.toBN('1000').mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))); // 1000 tokens
    await loanToken.transfer(recipient, transferAmount, { from: deployer });

    const deployerBalance: BN = await loanToken.balanceOf(deployer);
    const recipientBalance: BN = await loanToken.balanceOf(recipient);

    assert.strictEqual(deployerBalance.toString(), initialSupply.mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))).sub(transferAmount).toString());
    assert.strictEqual(recipientBalance.toString(), transferAmount.toString());
  });

  it("should allow approval and transferFrom", async () => {
    const approveAmount: BN = web3.utils.toBN('500').mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))); // 500 tokens
    await loanToken.approve(recipient, approveAmount, { from: deployer });

    await loanToken.transferFrom(deployer, recipient, approveAmount, { from: recipient });

    const deployerBalance: BN = await loanToken.balanceOf(deployer);
    const recipientBalance: BN = await loanToken.balanceOf(recipient);

    assert.strictEqual(deployerBalance.toString(), initialSupply.mul(web3.utils.toBN('10').pow(web3.utils.toBN('18'))).sub(approveAmount).toString());
    assert.strictEqual(recipientBalance.toString(), approveAmount.toString());
  });
});
