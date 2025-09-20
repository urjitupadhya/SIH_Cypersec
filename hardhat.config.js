import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local development network
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // Ethereum testnets
    goerli: {
      url: process.env.GOERLI_RPC_URL || "https://goerli.infura.io/v3/your-project-id",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 5,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/your-project-id",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    // Polygon testnets
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/your-api-key",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    // Polygon mainnet (for production)
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/your-api-key",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
    }
  },
  mocha: {
    timeout: 40000,
  },
};

export default config;