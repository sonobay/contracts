import { ethers } from "hardhat";
import { Market } from "../typechain-types";

async function main() {
  const Market = await ethers.getContractFactory("Market");
  const market = (await Market.deploy(
    "0x15191385C24876AB5B3Fa8637d53264BF0711E01",
    [
      "0x666d3cf23C338F7A2fe3416627B03729fa518Be5",
      "0x95655AAe7F5079ac99d640F5b3633156b41E7108",
    ],
    [50, 50]
  )) as Market;
  await market.deployed();

  console.log("market address is: ", market.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
