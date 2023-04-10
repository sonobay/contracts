import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { MIDIMarket, MIDI, Listing } from "../typechain-types";
import { BigNumber, Contract, utils } from "ethers";
import * as ListingArtifact from "../artifacts/contracts/listing/Listing.sol/Listing.json";
import * as PaymentSplitterArtifact from "../artifacts/@openzeppelin/contracts/finance/PaymentSplitter.sol/PaymentSplitter.json";

describe("Listing", function () {
  const price = 1_000_000_000_000_000;

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function setup() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Midi = await ethers.getContractFactory("MIDI");
    const midi = (await Midi.deploy()) as MIDI;

    const Market = await ethers.getContractFactory("MIDIMarket");
    const market = (await Market.deploy(
      midi.address,
      [owner.address],
      [100]
    )) as MIDIMarket;

    // mint midi
    const res = await midi.mint(owner.address, 20, "", []);
    await res.wait();

    // const formattedPrice = utils.parseUnits(String(1));

    // const listingRes = await market.createListing(1, 10, formattedPrice, []);
    // console.debug("listing res is: ", listingRes);
    // const tx = await listingRes.wait();
    // console.debug("listing is: ", listing);

    // const listingCreatedEvent = tx.events?.find(
    //   (_event) => _event.event === "ListingCreated"
    // );

    const Listing = await ethers.getContractFactory("Listing");
    // const price = 1_000_000_000_000_000;
    const listing = await upgrades.deployProxy(Listing, [
      price,
      owner.address,
      midi.address,
      1,
    ]);

    await midi.safeTransferFrom(owner.address, listing.address, 1, 10, []);

    // const listing = new Contract(listingCreatedEvent?.args?.listing) as Listing
    // const listing = new Listing__factory()

    // const listing = new Contract(listingCreatedEvent?.args?.listing, ) as Listing

    return { midi, market, owner, otherAccount, listing };
  }

  describe("Initialized values should be set", async () => {
    it("should have correct price", async () => {
      const { listing } = await loadFixture(setup);

      expect(await listing.price()).to.eq(price);
    });

    it("should have correct seller", async () => {
      const { listing, owner } = await loadFixture(setup);

      expect(await listing.seller()).to.eq(owner.address);
    });

    it("should have correct token id", async () => {
      const { listing } = await loadFixture(setup);

      expect(await listing.tokenId()).to.eq(1);
    });

    it("should have correct MIDI address", async () => {
      const { listing, midi } = await loadFixture(setup);

      expect(await listing.nftAddress()).to.eq(midi.address);
    });

    it("should have correct listed value", async () => {
      const { listing } = await loadFixture(setup);

      expect(await listing.listed()).to.eq(true);
    });
  });

  describe("Buy", async function () {
    it("should buy NFT", async () => {
      const { listing, otherAccount, midi } = await loadFixture(setup);
      await expect(
        listing.connect(otherAccount).buyItems(2, otherAccount.address, {
          value: BigNumber.from(price).mul(2),
        })
      )
        .to.emit(midi, "TransferSingle")
        .withArgs(listing.address, listing.address, otherAccount.address, 1, 2);
    });

    it("should fail if trying to buy more NFTs than the contract holds", async () => {
      const { listing, otherAccount } = await loadFixture(setup);
      expect(
        listing
          .connect(otherAccount)
          .buyItems(30, { value: BigNumber.from(price).mul(30) })
      ).to.be.revertedWith("amount not available");
    });

    it("should fail sending the incorrect amount", async () => {
      const { listing, otherAccount } = await loadFixture(setup);

      // sending too much
      expect(
        listing
          .connect(otherAccount)
          .buyItems(1, { value: BigNumber.from(price).mul(2) })
      ).to.be.revertedWith("incorrect payment");

      // sending too little
      expect(
        listing
          .connect(otherAccount)
          .buyItems(2, { value: BigNumber.from(price) })
      ).to.be.revertedWith("incorrect payment");
    });

    it("should fail to purchase when listing is canceled", async () => {
      const { listing, otherAccount } = await loadFixture(setup);

      const tx = await listing.cancelListing();
      await tx.wait();

      expect(
        listing
          .connect(otherAccount)
          .buyItems(1, { value: BigNumber.from(price) })
      ).to.be.revertedWith("Listing canceled");

      expect(await listing.listed()).to.eq(false);
    });
  });

  describe("Withdrawal", async () => {
    it("should successfully withdraw", async () => {
      const { market, owner, otherAccount, midi } = await loadFixture(setup);

      await midi.setApprovalForAll(market.address, true);

      const res = await market.createListing(1, 10, price, []);
      const tx = await res.wait();
      const listingCreatedEvent = tx.events?.find(
        (_event) => _event.event === "ListingCreated"
      );
      const listingAddress = listingCreatedEvent?.args?.listing;
      const listingContract = new Contract(
        listingAddress,
        ListingArtifact.abi,
        owner
      ) as Listing;
      const cost = BigNumber.from(price).mul(10);

      await listingContract
        .connect(otherAccount)
        .buyItems(10, otherAccount.address, { value: cost });

      const marketFee = 300;
      const feeAmount = BigNumber.from(cost).mul(marketFee).div(10_000);
      const expectedWithdraw = BigNumber.from(cost).sub(feeAmount);
      const paymentSplitterAddress = await market.paymentSplitter();
      const paymentSplitter = new Contract(
        paymentSplitterAddress,
        PaymentSplitterArtifact.abi
      );

      await expect(listingContract.withdraw())
        .to.emit(listingContract, "FundsWithdrew")
        .withArgs(expectedWithdraw)
        .to.changeEtherBalance(paymentSplitter.address, feeAmount)
        .to.changeEtherBalance(owner.address, expectedWithdraw)
        .to.changeEtherBalance(
          listingAddress,
          `-${expectedWithdraw.add(feeAmount).toString()}`
        );
    });
  });
});
