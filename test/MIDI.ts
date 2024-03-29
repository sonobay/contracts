import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MIDI", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.

  const ipfsPath = "ipfs://abcd1234";

  async function setup() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Midi = await ethers.getContractFactory("MIDI");
    const midi = await Midi.deploy();

    return { midi, owner, otherAccount };
  }

  describe("Mint", function () {
    it("Should be token 0", async () => {
      const { midi } = await loadFixture(setup);
      expect(await midi.currentTokenId()).to.eq(0);
    });

    it("Should mint and emit TransferSingle", async function () {
      const { midi, owner } = await loadFixture(setup);
      const amount = 1000;

      const mint = await midi.mint(owner.address, 1000, ipfsPath, []);

      await expect(mint)
        .to.emit(midi, "TransferSingle")
        .withArgs(
          owner.address,
          ethers.constants.AddressZero,
          owner.address,
          1,
          amount
        );

      expect(await midi.currentTokenId()).to.eq(1);
    });

    it("Should increment token ID after mint", async () => {
      const { midi, owner } = await loadFixture(setup);
      await midi.mint(owner.address, 1000, ipfsPath, []);
      expect(await midi.currentTokenId()).to.eq(1);
    });

    it("Should return the correct IPFS URI", async () => {
      const { midi, owner } = await loadFixture(setup);
      await midi.mint(owner.address, 1000, ipfsPath, []);
      expect(await midi.uri(1)).to.eq(ipfsPath);
    });

    it("Should burn single token", async () => {
      const { midi, owner } = await loadFixture(setup);

      const amountToBurn = 1;
      const tokenId = 1;

      await midi.mint(owner.address, 10, ipfsPath, []);

      const burn = await midi.burn(owner.address, tokenId, amountToBurn);

      await expect(burn)
        .to.emit(midi, "TransferSingle")
        .withArgs(
          owner.address,
          owner.address,
          ethers.constants.AddressZero,
          tokenId,
          amountToBurn
        );
    });

    it("Should burn batch token", async () => {
      const { midi, owner } = await loadFixture(setup);

      const amountsToBurn = [5, 7];
      const tokenIds = [1, 2];

      await midi.mint(owner.address, 10, ipfsPath, []);
      await midi.mint(owner.address, 10, ipfsPath, []);

      const burn = await midi.burnBatch(owner.address, tokenIds, amountsToBurn);

      await expect(burn)
        .to.emit(midi, "TransferBatch")
        .withArgs(
          owner.address,
          owner.address,
          ethers.constants.AddressZero,
          tokenIds,
          amountsToBurn
        );
    });
  });
});
