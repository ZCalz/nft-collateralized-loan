import { useState, useEffect, useContext } from "react"
import { WalletContext } from "../dapp-context/Web3Connect"
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

type LoanInfo = {
  borrower: string
  loanAmount: number
  nftAddress: string
  tokenId: number
}

export default function App() {
  const walletContext = useContext(WalletContext);
  if (!walletContext) {
    throw new Error("WalletInfo must be used within a WalletProvider");
  }
  const { nftTxContract, loanTokenTxContract, nftCollateralLoanIssuerTxContract, account, provider,  } = walletContext;
  const [userNFTs, setUserNFTs] = useState<number[] | undefined>(undefined)
  const [userLoanTokens, setUserLoanTokens] = useState<string>('0')
  const [dappBalance, setDappBalance] = useState<string>('0')
  const [selectedNFT, setSelectedNFT] = useState<string | undefined>(undefined);
  const [userLoanInfo, setUserLoanInfo] = useState<LoanInfo[] | undefined>(undefined);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedNFT(value);
  };
  console.log("selectedNFT: ", selectedNFT)

  const collateralizeNFT = async (nftTokenId: number, loanAmount: number) => {
    const amt = ethers.utils.parseEther(String(loanAmount))
    if (nftTxContract && nftCollateralLoanIssuerTxContract) {
      try { 
        const approveTx = await nftTxContract.approve(nftCollateralLoanIssuerTxContract.address, nftTokenId);
        approveTx.wait()
        toast.success('approved nft for loan');
        const collateralizeTx = await nftCollateralLoanIssuerTxContract.collateralizeNFT(nftTxContract.address, nftTokenId, amt);
        collateralizeTx.wait()
        toast.success('collateralized nft');
      } catch (error) {
        console.error("Error collateralizing NFT:", error);
        toast.error('Error collateralizing NFT');
      }
    }
  };

  const mintNFT = async () => {
    if (account && nftTxContract) {
      try { 
        const mintTx = await nftTxContract.mint(account);
        mintTx.wait()
        toast.success('minted nft');
      } catch (error) {
        console.error("Error mint NFT:", error);
        toast.error('Error mint NFT');
      }
    }
  };

  useEffect(() => {
    if (nftTxContract && account) {
      const getNFTs = async () => {
        try {
          const nfts: number[] = []
          const tokenCount: number = (await nftTxContract.nextTokenId())
          for (let i = 0; i < tokenCount; i++) {
            const owner: string | null = await nftTxContract!.ownerOf(i)
            if (owner === account) {
              nfts.push(i)
            }
          }
          setUserNFTs(nfts)
        } catch (err) {
          console.error(err)
        }
      }
      getNFTs()
    }
  }, [account, nftTxContract ])

  useEffect(() => {
    if ( loanTokenTxContract && account) {
      const getTokenBalance = async () => {
        try {
          const balance: string = ethers.utils.formatEther(await loanTokenTxContract.balanceOf(account));
          setUserLoanTokens(balance)
        } catch (err) {
          console.error(err)
        }
      }
      getTokenBalance()
    }

    if (loanTokenTxContract && nftCollateralLoanIssuerTxContract) {
      const getLoanable = async () => {
        try {
          const balance: string = ethers.utils.formatEther(await loanTokenTxContract.balanceOf(nftCollateralLoanIssuerTxContract.address));
          setDappBalance(balance)
        } catch (err) {
          console.error(err)
        }
      }
      getLoanable()
    }
  }, [account, loanTokenTxContract, nftCollateralLoanIssuerTxContract])

  useEffect(() => {
    if ( nftCollateralLoanIssuerTxContract && account && provider) {
      const getLoans = async () => {
        try {
          const issuerAddress = nftCollateralLoanIssuerTxContract.address
          console.log("issuerAddress: ", issuerAddress);

          const events: ethers.Event[] = await nftCollateralLoanIssuerTxContract.queryFilter("LoanCreated", 0, "latest");
          const loans: LoanInfo[] = [];
          events.forEach((event: ethers.Event) => {
            if (event && event.args) {
              const { borrower, loanAmount, nftAddress, tokenId } = event.args
              console.log({borrower, loanAmount, nftAddress, tokenId})
              const loanInfo: LoanInfo = {
                borrower: borrower,
                loanAmount: Number(ethers.utils.formatEther(loanAmount)),
                nftAddress: nftAddress,
                tokenId: Number(tokenId),
              }
              loans.push(loanInfo);
            }
          });

          setUserLoanInfo(loans)
        } catch (err) {
          console.error(err)
        }
      }
      getLoans()

    }
  }, [account, nftCollateralLoanIssuerTxContract, provider])

  return (
    <div className="">
      <div className="flex flex-col bg-gray-700 text-white p-4">
        <h1 className="text-4xl font-bold">NFT Collateralize Loan Dapp</h1>
        <div className="text-xl text-black m-2 p-2 rounded-md bg-white">Available Funds to Loan: {dappBalance}</div>
      </div>
      <div className="grid grid-cols-2  gap-4 p-4">
        <div className="bg-gray-400 text-white flex h-auto rounded-md shadow-md">
          <div className="w-full h-full p-4">
            <h2 className="font-bold">Your NFTs</h2>
            <div className="text-black w-full grid grid-cols-3 grid-rows-auto gap-4 p-4">
              {userNFTs && userNFTs.map((id, key) => {
                return<div key={key} className="bg-yellow-300 p-4 rounded-md shadow-md">
                  <p>Token {id}</p>
                </div>
              })}
            </div>
          </div>
        </div>
        <div className="bg-gray-400 text-white flex h-auto rounded-md shadow-md">
          <div className="w-full h-full p-4">
            <h2 className="font-bold">Your Loans</h2>
            <div className="p-4">
              {userLoanInfo && userLoanInfo.map((loan, key) => {
                return<div key={key} className="bg-yellow-800 p-4 rounded-md shadow-md">
                  <p>Borrower: {loan.borrower}</p>
                  <p>LoanAmount: {loan.loanAmount}</p>
                  <p>NftAddress: {loan.nftAddress}</p>
                  <p>TokenId: {loan.tokenId}</p>
                </div>
              })}
            </div>
          </div>
        </div>
        <div className="bg-gray-400 text-white flex h-auto rounded-md shadow-md">
          <div className="w-full h-full p-4">
          <h2 className="font-bold">Collateralize Your NFTs</h2>
            <div className="p-4">
              <label htmlFor="options" className="block mt-4 my-2 text-sm font-medium text-gray-900">Choose an nft to collateralize:</label>
              <select
                id="options"
                value={selectedNFT}
                onChange={handleChange}
                className="block text-black w-full py-2 border border-gray-300 rounded-md"
              >
                {userNFTs && ["None",...userNFTs].map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button className="bg-yellow-600 p-4 px-8 rounded-md shadow-md" onClick={selectedNFT? ()=>{ collateralizeNFT(Number(selectedNFT), 1000)}: undefined} >Submit</button>
            </div>
          </div>
        </div>
        <div className="bg-gray-400 text-white flex h-auto rounded-md shadow-md">
          <div className="w-full h-full p-4">
            <h2 className="font-bold">Repay Your Loan</h2>
            <div className="p-4">
              {}
            </div>
          </div>
        </div>
      </div>
      <span>
        <div className="flex flex-col p-4">
          <h1 className="font-bold text-xl">TESTING DASHBOARD</h1>
          <div className="bg-gray-400 p-10 rounded-md shadow-md">
            <div className="flex">
              <h3 className="py-4 font-bold">Your Loan Token Amount: {userLoanTokens}</h3>
            </div>
            <div className="flex justify-evenly text-gray-200 gap-6 flex-col sm:flex-row">
              <button onClick={()=>mintNFT()} className="bg-green-600 p-8 rounded-md shadow-md">Mint NFT</button>
              <button className="bg-pink-600 p-8 rounded-md shadow-md">Burn 10000 of Your Loan Tokens</button>
              <button className="bg-pink-600 p-8 rounded-md shadow-md">Burn All Your Loan Tokens</button>
              <button className="bg-pink-600 p-8 rounded-md shadow-md">Mint Yourself 10000 Loan Tokens</button>
            </div>
          </div>
        </div>
      </span>
      <Toaster
          position="top-center"
          reverseOrder={false}
        />
    </div>
  )
}