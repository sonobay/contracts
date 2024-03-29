import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";

describe("Market", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function setup() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Midi = await ethers.getContractFactory("MIDI");
    const midi = await Midi.deploy();

    const Listing = await ethers.getContractFactory("Listing");
    const listing = await Listing.deploy();

    const Market = await ethers.getContractFactory("MIDIMarket");
    const market = await Market.deploy(midi.address, listing.address);

    return { midi, market, owner, otherAccount };
  }

  describe("Market", function () {
    describe("Fees", () => {
      it("should have initial value", async () => {
        const { market } = await loadFixture(setup);

        expect(await market.fee()).to.eq(300);
      });

      it("should update the value", async () => {
        const { market } = await loadFixture(setup);
        const newFee = 500;
        await expect(market.setFee(newFee))
          .to.emit(market, "FeeUpdated")
          .withArgs(newFee);
      });

      it("should fail when non owner tries to update fees", async () => {
        const { market, otherAccount } = await loadFixture(setup);
        expect(market.connect(otherAccount).setFee(500)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("MIDI NFT address", async () => {
      it("should have initial value", async () => {
        const { market } = await loadFixture(setup);
        expect(await market.midi()).to.exist;
      });

      it("should successfully update value", async () => {
        const { market, otherAccount } = await loadFixture(setup);
        await expect(market.setMidiAddress(otherAccount.address))
          .to.emit(market, "MidiAddressUpdated")
          .withArgs(otherAccount.address);
      });

      it("should fail when non-owner tries to update MIDI address", async () => {
        const { market, otherAccount } = await loadFixture(setup);
        expect(
          market.connect(otherAccount).setMidiAddress(constants.AddressZero)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });

    describe("Listing", async () => {
      const tokenId = 1; // first minted MIDI should have token ID of 1
      const amountToSell = 20;
      const price = 1_000_000_000;

      it("should create a listing", async () => {
        const { market, owner, midi } = await loadFixture(setup);

        await midi.setApprovalForAll(market.address, true);
        await midi.mint(owner.address, 100, "", []);

        const listing = await market.createListing(
          tokenId,
          amountToSell,
          price,
          []
        );
        await expect(listing)
          .to.emit(market, "ListingCreated")
          .withArgs(tokenId, anyValue, amountToSell, price, owner.address);
      });

      it("should fail to update the listing address if it is not the owner", async () => {
        const { market, otherAccount } = await loadFixture(setup);

        expect(
          market.setListingAddress(otherAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("should successfully update the listing address if it is the owner", async () => {
        const { market } = await loadFixture(setup);

        await expect(market.setListingAddress(constants.AddressZero))
          .to.emit(market, "ListingAddressUpdated")
          .withArgs(constants.AddressZero);
      });

      it("should fail if user balance has insufficient NFTs", async () => {
        const { market, owner, midi } = await loadFixture(setup);
        await midi.setApprovalForAll(market.address, true);
        await midi.mint(owner.address, 1, "", []);

        expect(
          market.createListing(tokenId, amountToSell, price, [])
        ).to.be.revertedWith("Insufficient funds");
      });

      it("should fail if price is less than or equal to 0", async () => {
        const { market, owner, midi } = await loadFixture(setup);
        await midi.setApprovalForAll(market.address, true);
        await midi.mint(owner.address, amountToSell, "", []);

        expect(
          market.createListing(tokenId, amountToSell, 0, [])
        ).to.be.revertedWith("Invalid price");
      });

      it("should map new listing in tokenIdToListing", async () => {
        const { market, owner, midi } = await loadFixture(setup);

        await midi.setApprovalForAll(market.address, true);
        await midi.mint(owner.address, 100, "", []);

        const listing = await market.createListing(
          tokenId,
          amountToSell,
          price,
          []
        );

        await expect(listing)
          .to.emit(market, "ListingCreated")
          .withArgs(tokenId, anyValue, amountToSell, price, owner.address);

        const tx = await listing.wait();

        const listingCreatedEvent = tx.events?.find(
          (_event) => _event.event === "ListingCreated"
        );

        expect(await market.tokenIdToListing(1)).to.contain(
          listingCreatedEvent?.args?.listing
        );
      });
    });

    describe("Withdraw from market", async () => {
      it("should fail to withdraw if attempted by non-owner", async () => {
        const { market, otherAccount } = await loadFixture(setup);

        expect(
          market.connect(otherAccount).withdrawTo(otherAccount.address, 100)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("should fail to withdraw if amount is greater than balance", async () => {
        const { market, owner } = await loadFixture(setup);

        expect(market.withdrawTo(owner.address, 1)).to.be.revertedWith(
          "Insufficient funds"
        );
      });

      it("should successfully withdraw if amount is less than or equal to balance", async () => {
        const { market, owner } = await loadFixture(setup);
        let marketBalance = await owner.provider?.getBalance(market.address);

        expect(marketBalance).to.eq(0);

        const sendToMarketTx = await owner.sendTransaction({
          to: market.address,
          value: 100,
        });
        await sendToMarketTx.wait();

        marketBalance = await owner.provider?.getBalance(market.address);

        expect(marketBalance).to.eq(100);
        await expect(market.withdrawTo(owner.address, 100))
          .to.emit(market, "WithdrawTo")
          .withArgs(owner.address, 100)
          .to.changeEtherBalance(market.address, 0)
          .to.changeEtherBalance(owner.address, 100);
      });
    });
  });
});
