import { task, types } from "hardhat/config";

task("deployListing", "Deploys Listing contract").setAction(
  async ({}, { ethers, run }) => {
    const Listing = await ethers.getContractFactory("Listing");
    const listing = await Listing.deploy();
    await listing.deployed();

    console.log("listing address is: ", listing.address);
  }
);
