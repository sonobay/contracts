import { Contract } from "ethers";
import { task, types } from "hardhat/config";
import * as MIDIArtifact from "../artifacts/contracts/midi/MIDI.sol/MIDI.json";

task("mintMIDI", "Mints MIDI tokens")
  .addParam("midi", "Address of the MIDI contract", undefined, types.string)
  .addParam("metadataURI", "URI of the metadata", undefined, types.string)
  .addParam("amount", "Amount of tokens to mint", 1, types.int)
  .setAction(
    async (
      {
        midi,
        metadataURI,
        amount,
      }: { midi: string; metadataURI: string; amount: number },
      { ethers, run }
    ) => {
      const accounts = await ethers.getSigners();
      const contract = new Contract(midi, MIDIArtifact.abi, accounts[0]);

      const tx = await contract.mint(
        accounts[1].address,
        amount,
        metadataURI,
        []
      );
      console.log("tx is: ", tx);
      const res = await tx.wait();
      console.log("res is: ", res);

      const currentTokenId = await contract.currentTokenId();
      console.log("current token id is: ", currentTokenId.toString());
    }
  );
