import { task } from "hardhat/config";

interface EtherScanCurrencyResponse {
  status: string;
  message: string;
  result: {
    ethusd: string;
  };
}

task(
  "estimateDeployMidi",
  "Estimates cost of deploying MIDI contract"
).setAction(async ({}, { ethers }) => {
  const MIDI = await ethers.getContractFactory("MIDI");
  const signer = MIDI.signer;
  const signerBalance = await signer.getBalance();
  const address = await signer.getAddress();

  console.log("signer address is: ", address);
  console.log(
    "signer balance is: ",
    ethers.utils.formatEther(signerBalance).toString()
  );

  const estimatedGas = await MIDI.signer.estimateGas(
    MIDI.getDeployTransaction()
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
});
