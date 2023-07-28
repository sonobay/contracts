import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter"
import "./tasks"

dotenv.config();

const { POLYSCAN_API_KEY, ETHERSCAN_API_KEY, MNENOMIC } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: {
        mnemonic: MNENOMIC ?? "",
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: { mnemonic: MNENOMIC ?? "" },
    },
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts: {
        mnemonic: MNENOMIC ?? "",
        initialIndex: 2,
      },
    },
    polygon: {
      url: process.env.POLYGON_MAINNET_URL || "",
      accounts: {
        mnemonic: MNENOMIC ?? "",
        initialIndex: 2,
      },
      chainId: 137,
    },
    polygonMumbai: {
      url: process.env.POLYGON_MUMBAI_URL || "",
      accounts: {
        mnemonic: MNENOMIC ?? "",
        initialIndex: 2,
      },
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: {
      polygon: POLYSCAN_API_KEY ?? "",
      polygonMumbai: POLYSCAN_API_KEY ?? "",
      mainnet: ETHERSCAN_API_KEY ?? "",
      sepolia: ETHERSCAN_API_KEY ?? "",
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    enabled: true,
  },
};

export default config;
