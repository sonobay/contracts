// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IListing {
    // event FeeUpdated(uint32 fee);
    // event ListingCreated(uint256 tokenId, uint256 amount, address user);
    // event MidiAddressUpdated(address midi);

    // function fee() external view returns (uint32);

    // function midi() external view returns (address);
    function cancelListing() external;

    function seller() external view returns (address);
}
