import { Contract } from "ethers";
import { ethers } from "hardhat";
import { MIDI } from "../typechain-types";

async function main() {
  const MIDI = await ethers.getContractFactory("MIDI");
  const midi = (await MIDI.deploy()) as MIDI;
  await midi.deployed();

  console.log("midi address is: ", midi.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
