import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "./tasks";

dotenv.config();

const { ETHERSCAN_API_KEY, MNENOMIC } = process.env;

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
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
