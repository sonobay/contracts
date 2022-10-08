// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../market/IMarket.sol";
import "./IListing.sol";
import "hardhat/console.sol";

contract Listing is Initializable, OwnableUpgradeable, ERC1155Holder, IListing {
    uint256 private _price;
    address private _seller;
    bool private _listed;
    address private _nft;
    uint256 private _tokenId;

    event ItemsPurchased(
        address nft,
        uint256 tokenId,
        uint256 price,
        uint256 amount,
        address buyer,
        address seller
    );

    constructor() {}

    function initialize(
        uint256 price_,
        address seller_,
        address midi_,
        uint256 tokenId_
    ) public initializer {
        __Ownable_init();
        _price = price_;
        _seller = seller_;
        _listed = true;
        _nft = midi_;
        _tokenId = tokenId_;
    }

    function buyItems(uint256 amount, address to) external payable {
        require(
            IERC1155(_nft).balanceOf(address(this), _tokenId) - amount >= 0,
            "amount not available"
        );
        require(msg.value == _price * amount, "incorrect payment");
        require(_listed == true, "Listing canceled");

        IERC1155(_nft).safeTransferFrom(
            address(this),
            to,
            _tokenId,
            amount,
            ""
        );
    }

    function cancelListing() external {
        require(_listed == true, "Listing previously canceled");
        require(_msgSender() == _seller, "Unauthorized");
        _listed = false;

        IERC1155(_nft).safeTransferFrom(
            address(this),
            _msgSender(),
            _tokenId,
            IERC1155(_nft).balanceOf(address(this), _tokenId),
            ""
        );

        emit ListingCanceled();
    }

    function withdraw() external {
        require(_msgSender() == _seller, "Unauthorized");
        uint256 feeAmount = (address(this).balance * IMarket(owner()).fee()) /
            10_000;

        uint256 userWithdraw = address(this).balance - feeAmount;

        /**
         * Pay fee to market
         */
        payable(IMarket(owner()).paymentSplitter()).transfer(feeAmount);

        /**
         * Send remaining to seller
         */
        payable(_msgSender()).transfer(userWithdraw);

        emit FundsWithdrew(userWithdraw);
    }

    function price() external view returns (uint256) {
        return _price;
    }

    function seller() external view returns (address) {
        return _seller;
    }

    function tokenId() external view returns (uint256) {
        return _tokenId;
    }

    function nftAddress() external view returns (address) {
        return _nft;
    }

    function listed() external view returns (bool) {
        return _listed;
    }
}
