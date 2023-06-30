// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMarket {
    event FeeUpdated(uint32 fee);
    event ListingCreated(
        address tokenAddress,
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
    event ListingAddressUpdated(address listing);
    event CustomListingAddressUpdated(address customListing);
    event WithdrawTo(address indexed to, uint256 amount);

    function fee() external view returns (uint32);

    function midi() external view returns (address);

    function withdrawTo(address payable to, uint256 amount) external;
}
