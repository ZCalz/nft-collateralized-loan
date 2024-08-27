import { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { LoanTokenAbi, NFTAbi, NFTCollateralLoanIssuerAbi } from '../utils/constants'
import { NetworkMap } from '../utils/networks'
import { ExternalProvider } from '@ethersproject/providers';

declare global {
  interface Window{
    ethereum?:ExternalProvider
  }
}

// Define the shape of the context
interface WalletContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  connectWallet: () => Promise<void>;
  nftTxContract: ethers.Contract | null;
  loanTokenTxContract: ethers.Contract | null;
  nftCollateralLoanIssuerTxContract: ethers.Contract | null;
}

// Create the context with the appropriate type
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Define the props for the WalletProvider component
interface WalletProviderProps {
  children: ReactNode;
}

// Create a provider component
const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [ nftTxContract, setNftTxContract ] = useState<ethers.Contract | null>(null);
  const [ nftCollateralLoanIssuerTxContract, setNftCollateralLoanIssuerTxContract ] = useState<ethers.Contract | null>(null);
  const [ loanTokenTxContract, setLoanTokenTxContract ] = useState<ethers.Contract | null>(null);

  const { Nft, LoanToken, NFTCollateralLoanIssuer } = NetworkMap.LINEA_SEPOLIA
  console.log('network addresses: ', {
    Nft, LoanToken, NFTCollateralLoanIssuer
  })
  // Function to connect to the wallet
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const account = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        console.log("provider: ", provider);
        console.log("signer: ", signer);
        console.log("account: ", account);
      } else {
        alert("Please install MetaMask: https://metamask.io/");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  // Automatically connect to wallet if already connected
  useEffect(() => {
    if (window.ethereum && provider === null) {
      console.log("Ethereum found!");
      connectWallet();
    } else {
      console.log("No Ethereum found!");
    }

    if (signer && nftTxContract === null) {
      const transactionContract = new ethers.Contract(Nft, NFTAbi, signer);
      setNftTxContract(transactionContract);
      console.log("transactionContract NFT: ", transactionContract);
    }

    if (signer && loanTokenTxContract === null) {
      const transactionContract = new ethers.Contract(LoanToken, LoanTokenAbi, signer);
      setLoanTokenTxContract(transactionContract);
      console.log("transactionContract LoanToken: ", transactionContract);
    }


    if (signer && nftCollateralLoanIssuerTxContract === null) {
      const transactionContract = new ethers.Contract(NFTCollateralLoanIssuer, NFTCollateralLoanIssuerAbi, signer);
      setNftCollateralLoanIssuerTxContract(transactionContract);
      console.log("transactionContract NFTCollateralLoanIssuer: ", transactionContract);
    }


  }, [provider, signer, nftTxContract, loanTokenTxContract, nftCollateralLoanIssuerTxContract, Nft, LoanToken, NFTCollateralLoanIssuer]);

  return (
    <WalletContext.Provider value={{ provider, signer, account, connectWallet, nftTxContract, loanTokenTxContract, nftCollateralLoanIssuerTxContract }}>
      {children}
    </WalletContext.Provider>
  );
};

// Export the context and provider
export { WalletContext, WalletProvider };
