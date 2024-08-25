

# NFT Collaterlized Loan

This README provides instructions for setting up and running this project. It includes prerequisites, installation steps, and how to start a local blockchain, run tests, and deploy contracts.

## Prerequisites

Before you begin, ensure you have the following software installed:

- [Node.js](https://nodejs.org/) (v18.18.2 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Truffle](https://www.trufflesuite.com/truffle) (v5.11.5 or later)
- [Ganache](https://www.trufflesuite.com/ganache) (v7.9.1 or later)

### Installing Prerequisites

1. **Install Node.js and npm:**

   Download and install Node.js from the [official website](https://nodejs.org/). This will also install npm.

2. **Install Truffle:**

   Install Truffle globally using npm:

   ```bash
   npm install -g truffle
   ```

3. **Install Ganache:**

   Download Ganache from the [official website](https://www.trufflesuite.com/ganache) and install it.

   Or install from terminal:

   ```bash
   npm i -g ganache
   ```
3. **Install Fuzzing Tooling:**

    ```bash
    pip3 install diligence-fuzzing
    npm i -g eth-scribble
    ```

    Follow the rest of the steps here on the Diligence [official website](https://fuzzing-docs.diligence.tools/getting-started/fuzzing-non-foundry-projects)


## Project Setup

Follow these steps to set up and run the project:

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/ZCalz/nft-collateralized-loan.git
cd nft-collateralized-loan
```

### 2. Install Project Dependencies

Install the project dependencies using npm:

```bash
npm install
```

Copy the environment variables into an env file:

```bash
cp .env.example .env
```

Add your private key and Infura project id to the environment. You can obtain an Infura project id from the [Infura website](https://www.infura.io/).

```
PROJECT_ID=<your-infura-project-id>
PK=<your-private-key>
```

### 3. Start a Local Blockchain

You can use Ganache to start a local Ethereum blockchain. Open Ganache and create a new workspace, or use the Ganache CLI if preferred.

- **Ganache GUI:**
  - Launch Ganache and configure a new workspace.

- **Ganache CLI:**
  - Install Ganache CLI globally:

    ```bash
    npm install -g ganache-cli
    ```

  - Start Ganache CLI:

    ```bash
    ganache-cli
    ```

### 4. Compile Contracts

Compile the smart contracts using Truffle:

```bash
truffle compile
```

### 5. Migrate Contracts

You can deploy the contract to any network specified in the `truffle.config.js` file. To deploy the contracts use:

```bash
truffle migrate --network <network-name>
```

Deploy the smart contracts to the local blockchain:

```bash
truffle migrate --network development
```

After the project fully deploys, the deployed contract's addresses will appear in the `deployed_addresses` directory according to the network name.

- **Deploy Specific Migration File:**

  If you need to deploy a specific migration file, use:

  ```bash
  truffle migrate --f <migration_number> --to <migration_number> --network development
  ```

### 6. Run Tests

Run the tests to ensure everything is working correctly:

```bash
truffle test --network development
```

### 7. Using Fuzzer

Arming:
```bash
fuzz arm contracts/NFTCollateralLoanIssuer.sol contracts/NFT.sol
```

Disarming:
```bash
fuzz disarm contracts/NFTCollateralLoanIssuer.sol contracts/NFT.sol
```

Run:
```bash
fuzz run
```

## Additional Commands

- **Run Truffle Console:**

  Launch a Truffle console connected to the local blockchain:

  ```bash
  truffle console --network development
  ```

- **Interact with Deployed Contracts:**

  Use the Truffle console to interact with the deployed contracts and perform transactions.

## Troubleshooting

If you encounter issues, consider the following:

- Ensure that the `truffle-config.js` is properly configured for the correct network.
- Verify that Ganache or Ganache CLI is running before deploying contracts.
- Check for any errors or issues in the Truffle output and logs.

For more detailed Truffle documentation, visit the [Truffle Documentation](https://www.trufflesuite.com/docs/truffle/overview).
