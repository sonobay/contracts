// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IListing {
    event ListingCanceled();
    event FundsWithdrew(uint256 amount);

    function cancelListing() external;

    function buyItems(uint256 amount, address to) external payable;

    function withdraw() external;

    function price() external view returns (uint256);

    function seller() external view returns (address);

    function tokenId() external view returns (uint256);

    function nftAddress() external view returns (address);

    function listed() external view returns (bool);
}
