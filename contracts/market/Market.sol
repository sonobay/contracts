// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "../listing/Listing.sol";
import "../listing/CustomListing.sol";
import "../listing/IListing.sol";
import "./IMarket.sol";

contract MIDIMarket is Ownable, IMarket {
    uint32 private _fee = 300; // basis points out of 10000
    address private _midi;
    address private _listing;
    address private _customListing;

    mapping(uint256 => address[]) private _tokenIdToListing;

    constructor(address midi_, address listing_, address customListing_) {
        _midi = midi_;
        _listing = listing_;
        _customListing = customListing_;
    }

    function createListing(
        uint256 id,
        uint256 amount,
        uint256 price,
        bytes memory data
    ) external {
        // require user to own NFT
        require(
            IERC1155(_midi).balanceOf(msg.sender, id) >= amount,
            "Insufficient funds"
        );

        // must set a price above 0
        require(price > 0, "Invalid price");

        // must have approved marketplace
        require(
            IERC1155(_midi).isApprovedForAll(msg.sender, address(this)),
            "MIDI not approved"
        );

        address clone = Clones.clone(_listing);
        Listing(clone).initialize(price, msg.sender, _midi, id);

        _tokenIdToListing[id].push(clone);

        IERC1155(_midi).safeTransferFrom(msg.sender, clone, id, amount, data);

        emit ListingCreated(address(0), id, clone, amount, price, msg.sender);
    }

    function createCustomListing(
        address tokenAddress,
        uint256 id,
        uint256 amount,
        uint256 price,
        bytes memory data
    ) external {
        // require user to own NFT
        require(
            IERC1155(_midi).balanceOf(msg.sender, id) >= amount,
            "Insufficient funds"
        );

        // must set a price above 0
        require(price > 0, "Invalid price");

        // must have approved marketplace
        require(
            IERC1155(_midi).isApprovedForAll(msg.sender, address(this)),
            "MIDI not approved"
        );

        address clone = Clones.clone(_customListing);
        CustomListing(clone).initialize(tokenAddress, price, msg.sender, _midi, id);

        _tokenIdToListing[id].push(clone);

        IERC1155(_midi).safeTransferFrom(msg.sender, clone, id, amount, data);

        emit ListingCreated(tokenAddress, id, clone, amount, price, msg.sender);
    }

    /**
     * @dev Sets the address of the listing contract
     * used to clone new listings
     * @param newAddress The address of the listing contract
     */
    function setListingAddress(address newAddress) external onlyOwner {
        _listing = newAddress;
        emit ListingAddressUpdated(_listing);
    }

    /**
     * @dev Sets the address of the listing contract
     * used to clone new listings
     * @param newAddress The address of the listing contract
     */
    function setCustomListingAddress(address newAddress) external onlyOwner {
        _customListing = newAddress;
        emit CustomListingAddressUpdated(_customListing);
    }

    function tokenIdToListing(
        uint256 id
    ) external view returns (address[] memory) {
        return _tokenIdToListing[id];
    }

    function fee() external view returns (uint32) {
        return _fee;
    }

    function midi() external view returns (address) {
        return _midi;
    }

    function setFee(uint32 newFee) external onlyOwner {
        _fee = newFee;
        emit FeeUpdated(_fee);
    }

    function setMidiAddress(address newAddress) external onlyOwner {
        _midi = newAddress;
        emit MidiAddressUpdated(_midi);
    }

    function withdrawTo(address payable to, uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        (bool success, ) = to.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
        emit WithdrawTo(to, amount);
    }

    receive() external payable {}
}
