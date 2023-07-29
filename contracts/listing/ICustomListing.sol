// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
pragma solidity ^0.8.9;

interface ICustomListing {
    event ListingCanceled();
    event FundsWithdrew(uint256 amount);

    function initialize(
        address tokenAddress,
        uint256 price_,
        address seller_,
        address midi_,
        uint256 tokenId_
    ) external;

    function cancelListing() external;

    function buyItems(uint256 amount, address to) external payable;

    function withdraw() external;

    function price() external view returns (uint256);

    function seller() external view returns (address);

    function tokenId() external view returns (uint256);

    function nftAddress() external view returns (address);

    function listed() external view returns (bool);
}
