import { ethers } from "hardhat";

async function main() {
  const Market = await ethers.getContractFactory("MIDIMarket");
  const market = await Market.deploy(
    "0xe87f6cfD3B2e6DB1D82a3e3fd0Fc9D3bE193C196",
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
