import { task, types } from "hardhat/config";
import { MIDI } from "../typechain-types";

task("deployMidi", "Deploys MIDI contract").setAction(
  async ({}, { ethers, run }) => {
    const MIDI = await ethers.getContractFactory("MIDI");
    const midi = (await MIDI.deploy()) as MIDI;
    await midi.deployed();

    console.log("midi address is: ", midi.address);
  }
);
