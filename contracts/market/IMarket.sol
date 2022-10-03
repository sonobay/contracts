// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMarket {
    event FeeUpdated(uint32 fee);
    event ListingCreated(
        uint256 indexed tokenId,
        address listing,
        uint256 amount,
        uint256 price,
        address indexed user
    );
    event MidiAddressUpdated(address midi);
    event PaymentSplitterUpdated(
        address previousAddress,
        address newAddress,
        address[] payees,
        uint256[] shares
    );

    function fee() external view returns (uint32);

    function midi() external view returns (address);

    function paymentSplitter() external view returns (address);
}
