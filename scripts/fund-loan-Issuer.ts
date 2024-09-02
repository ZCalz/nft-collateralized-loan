import { LoanTokenContract,LoanTokenInstance } from "../types/truffle-contracts/LoanToken";
import { NFTCollateralLoanIssuerContract, NFTCollateralLoanIssuerInstance } from "../types/truffle-contracts/NFTCollateralLoanIssuer";

// This will fund the loan issuer contract by minting the loanable erc20 tokens to it
// usage: npx truffle exec scripts/fund-loan-issuer.ts --network <network> <amount>
// replace the <network> with the network name and  <amount> with the amount of tokens to mint

module.exports = async function (callback: any) {
  try {
    const args = process.argv.slice(4);
    if (args.length !== 3) {
        console.log("Arguments passed:", args);
        throw new Error("Missing Arguments")
    }
    const [,,amount] = args

    const LoanToken: LoanTokenContract = artifacts.require("LoanToken");
    const instance: LoanTokenInstance = await LoanToken.deployed();

    const NFTCollateralLoanIssuer: NFTCollateralLoanIssuerContract = artifacts.require("NFTCollateralLoanIssuer");
    const issuerAddress = NFTCollateralLoanIssuer.address;

    const amountWei = web3.utils.toWei(amount, 'ether'); 
    
    await instance.mint(issuerAddress, amountWei)

    console.log(`${amount} tokens minted to Issuer: ${issuerAddress}`);

    const issuerBalance: BN = await instance.balanceOf(issuerAddress);

    console.log(`Issuer: ${issuerAddress} owns ${issuerBalance} tokens in total`);

    callback();
  } catch (error) {
    console.error("Error executing script:", error);
    callback(error);
  }
};
