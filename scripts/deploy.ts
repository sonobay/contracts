import { ethers } from "hardhat";
import { MIDI } from "../typechain-types";

async function main() {
  const MIDI = await ethers.getContractFactory("MIDI");
  const midi = (await MIDI.deploy()) as MIDI;
  await midi.deployed();

  console.log("midi address is: ", midi.address);

  const Market = await ethers.getContractFactory("MIDIMarket");
  const market = await Market.deploy(
    midi.address,
    [
      "0x666d3cf23C338F7A2fe3416627B03729fa518Be5",
      "0x95655AAe7F5079ac99d640F5b3633156b41E7108",
    ],
    [50, 50]
  );
  await market.deployed();

  console.log("market address is: ", market.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x32CF292cD6ebE04158745befFfDf774758E57EB5

// 0x48F5Ec0732c00054BbDcF95D78EE1e6b353665E2
