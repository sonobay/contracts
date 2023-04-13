import { task } from "hardhat/config";

interface EtherScanCurrencyResponse {
  status: string;
  message: string;
  result: {
    ethusd: string;
  };
}

task(
  "estimateDeployListing",
  "Estimates cost of deploying Listing contract"
).setAction(async ({}, { ethers }) => {
  const Listing = await ethers.getContractFactory("Listing");
  const signer = Listing.signer;
  const signerBalance = await signer.getBalance();
  const address = await signer.getAddress();

  console.log("signer address is: ", address);
  console.log(
    "signer balance is: ",
    ethers.utils.formatEther(signerBalance).toString()
  );

  const estimatedGas = await Listing.signer.estimateGas(
    Listing.getDeployTransaction()
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
