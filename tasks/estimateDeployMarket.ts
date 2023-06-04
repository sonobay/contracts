import { task, types } from "hardhat/config";
import { EtherScanCurrencyResponse } from "./types";

task("estimateDeployMarket", "Estimates cost of deploying MIDI contract")
  .addParam("midi", "Address of the MIDI contract", undefined, types.string)
  .addParam(
    "listing",
    "Address of the Listing contract",
    undefined,
    types.string
  )
  .setAction(
    async (
      {
        midi,
        listing,
      }: {
        midi: string;
        listing: string;
      },
      { ethers }
    ) => {
      const Market = await ethers.getContractFactory("MIDIMarket");
      const signer = Market.signer;
      const signerBalance = await signer.getBalance();
      const address = await signer.getAddress();

      console.log("signer address is: ", address);
      console.log(
        "signer balance is: ",
        ethers.utils.formatEther(signerBalance).toString()
      );

      const estimatedGas = await Market.signer.estimateGas(
        Market.getDeployTransaction(midi, listing)
      );
      console.log("estimated gas is: ", estimatedGas.toString());

      const gasPrice = await signer.getGasPrice();

      const deploymentPrice = gasPrice.mul(estimatedGas);
      console.log("estimated cost in WEI: ", deploymentPrice.toString());

      const inEth = ethers.utils.formatEther(deploymentPrice);
      console.log("estimate cost in ETH: ", inEth.toString());

      const etherScanResponse = await fetch(
        "https://api.etherscan.io/api?module=stats&action=ethprice"
      );
      const etherScanResponseJson =
        (await etherScanResponse.json()) as EtherScanCurrencyResponse;

      console.log(
        "estimate cost in USD: $",
        +inEth * +etherScanResponseJson.result.ethusd
      );
    }
  );
