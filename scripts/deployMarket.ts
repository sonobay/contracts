import { ethers } from "hardhat";
import { MIDIMarket__factory } from "../typechain-types";

async function main() {
  const Market = await ethers.getContractFactory("MIDIMarket");

  const midiAddress = "0x29c45A223f15da5cfCABC761e67E352Dc672a25a";
  const marketBeneficiaries = [
    "0x666d3cf23C338F7A2fe3416627B03729fa518Be5",
    "0x95655AAe7F5079ac99d640F5b3633156b41E7108",
  ];
  const beneficiarySplit = [50, 50];

  await estimateCost(
    Market,
    midiAddress,
    marketBeneficiaries,
    beneficiarySplit
  );

  const market = await Market.deploy(
    midiAddress,
    marketBeneficiaries,
    beneficiarySplit
  );
  await market.deployed();

  console.log("market address is: ", market.address);
}

const estimateCost = async (
  Market: MIDIMarket__factory,
  midiAddress: string,
  marketBeneficiaries: string[],
  beneficiarySplit: number[]
) => {
  const signer = Market.signer;

  const signerBalance = await signer.getBalance();
  console.log("signer balance is: ", signerBalance.toString());
  const address = await Market.signer.getAddress();
  console.log("address is: ", address);

  const estimatedGas = await Market.signer.estimateGas(
    Market.getDeployTransaction(
      midiAddress,
      marketBeneficiaries,
      beneficiarySplit
    )
  );
  console.log("estimated gas is: ", estimatedGas.toString());

  const gasPrice = await signer.getGasPrice();

  const deploymentPrice = gasPrice.mul(estimatedGas);
  console.log("estimated cost: ", deploymentPrice.toString());
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
