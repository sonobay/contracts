import { Contract } from "ethers";
import { task, types } from "hardhat/config";
import * as MarketArtifact from "../artifacts/contracts/market/Market.sol/MIDIMarket.json";

task("updateMidiAddressInMarket", "Updates MIDI Address in Market Contract")
  .addParam(
    "market",
    "Address of existing market contract",
    undefined,
    types.string
  )
  .addParam("midi", "New address of the MIDI contract", undefined, types.string)
  .setAction(
    async (
      { market, midi }: { midi: string; market: string },
      { ethers, run }
    ) => {
      const [deployer] = await ethers.getSigners();

      const marketContract = new Contract(market, MarketArtifact.abi, deployer);

      const tx = await marketContract.setMidiAddress(midi);

      console.log("Transaction hash: ", tx.hash);
    }
  );
