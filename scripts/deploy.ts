import { ethers } from "hardhat";
import { MIDI } from "../typechain-types";

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = ethers.utils.parseEther("1");

  // const Lock = await ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // await lock.deployed();

  // console.log("Lock with 1 ETH deployed to:", lock.address);

  const MIDI = await ethers.getContractFactory("MIDI");
  const midi = (await MIDI.deploy()) as MIDI;
  await midi.deployed();

  console.log("address is: ", midi.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x32CF292cD6ebE04158745befFfDf774758E57EB5

// 0x48F5Ec0732c00054BbDcF95D78EE1e6b353665E2
