// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../listing/Listing.sol";
import "../listing/IListing.sol";
import "./IMarket.sol";

contract Market is Ownable, IMarket {
    uint32 private _fee = 300; // basis points out of 10000
    address private _midi;
    address private _listing;

    mapping(uint256 => address[]) private _tokenIdToListing;

    // mapping(uint256 => Listing[]) private tokenIdToListing;

    // // attempt 1
    // mapping(uint256 => mapping(address => Listing)) private test;
    // mapping(uint256 => address[]) private midiItemSellers;

    // // this might work
    // mapping(uint256 => mapping(uint256 => Listing)) private test2;
    // mapping(uint256 => uint256) private listingCount;

    constructor(address midi_) {
        _listing = address(new Listing());
        _midi = midi_;
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
        Listing(clone).initialize(price, msg.sender, amount, _midi, id);

        _tokenIdToListing[id].push(clone);

        IERC1155(_midi).safeTransferFrom(msg.sender, clone, id, amount, data);

        emit ListingCreated(id, clone, amount, price, msg.sender);
    }

    function tokenIdToListing(uint256 id)
        external
        view
        returns (address[] memory)
    {
        return _tokenIdToListing[id];
    }

    // function cancelListing(address listing) external {
    //     require(IListing(listing).seller == msg.sender, "Not authorized");
    //     IListing(listing).cancelListing();
    // }

    // function buyItems(address listing, uint256 amount) external {}

    // function withdrawProceeds() external {}

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
}
