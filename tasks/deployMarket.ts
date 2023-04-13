import { task, types } from "hardhat/config";
import { MIDIMarket__factory } from "../typechain-types";

task("deployMarket", "Deploys Market contract")
  .addParam("midi", "Address of the MIDI contract", undefined, types.string)
  .addParam(
    "listing",
    "Address of the Listing contract",
    undefined,
    types.string
  )
  .addParam(
    "beneficiaries",
    "Array of addresses for Market Payment Splitter",
    "[]",
    types.string
  )
  .addParam(
    "beneficiariesShares",
    "Array of numbers, how fees are divided, that corresponds with the above beneficiaries param",
    "[]",
    types.string
  )
  .setAction(
    async (
      {
        midi,
        listing,
        beneficiaries,
        beneficiariesShares,
      }: {
        midi: string;
        listing: string;
        beneficiaries: string;
        beneficiariesShares: string;
      },
      { ethers, run }
    ) => {
      if (!midi) {
        console.error("No MIDI address found");
        return;
      }

      if (!listing) {
        console.error("No Listing address found");
        return;
      }

      const beneficiaryAddresses: string[] =
        JSON.parse(beneficiaries.replace(/'/g, '"')) ?? [];

      const shares: number[] = JSON.parse(beneficiariesShares);

      const Market = await ethers.getContractFactory("MIDIMarket");

      await estimateCost(Market, midi, listing, beneficiaryAddresses, shares);

      const market = await Market.deploy(
        midi,
        listing,
        beneficiaryAddresses,
        shares
      );
      await market.deployed();

      console.log("market address is: ", market.address);
    }
  );

const estimateCost = async (
  Market: MIDIMarket__factory,
  midiAddress: string,
  listingAddress: string,
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
      listingAddress,
      marketBeneficiaries,
      beneficiarySplit
    )
  );
  console.log("estimated gas is: ", estimatedGas.toString());

  const gasPrice = await signer.getGasPrice();

  const deploymentPrice = gasPrice.mul(estimatedGas);
  console.log("estimated cost: ", deploymentPrice.toString());
};
