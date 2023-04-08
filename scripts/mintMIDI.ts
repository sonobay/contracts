import { Contract } from "ethers";
import { ethers } from "hardhat";
import * as MIDIArtifact from "../artifacts/contracts/midi/MIDI.sol/MIDI.json";

async function main() {
  /**
   * Enter MIDI address here
   */
  const midiAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const accounts = await ethers.getSigners();
  const midi = new Contract(midiAddress, MIDIArtifact.abi, accounts[0]);
  const metadataURI =
    "ipfs://bafyreidsncvm34ieksvjcopa24r3ki37fy2pznket4nbijzb6rsdhicpgm/metadata.json";

  const tx = await midi.mint(accounts[1].address, 10, metadataURI, []);
  console.log("tx is: ", tx);
  const res = await tx.wait();
  console.log("res is: ", res);

  const currentTokenId = await midi.currentTokenId();
  console.log("current token id is: ", currentTokenId.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
