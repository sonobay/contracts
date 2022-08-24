// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../market/IMarket.sol";

contract Listing is Ownable, Initializable {
    uint256 private _price;
    address private _seller;
    uint256 private _totalAmount;
    uint256 private _availableAmount;
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
        uint256 amount_,
        address midi_
    ) public initializer {
        _price = price_;
        _seller = seller_;
        _totalAmount = amount_;
        _availableAmount = amount_;
        _listed = true;
        _nft = midi_;
    }

    function buyItems(uint256 amount) external payable {
        require(_availableAmount - amount >= 0, "amount not available");
        require(msg.value == _price * amount, "incorrect payment");
        require(_listed == true, "Listing canceled");
        _availableAmount = _availableAmount - amount;
        IERC1155(_nft).safeTransferFrom(
            address(this),
            _msgSender(),
            _tokenId,
            amount,
            ""
        );
    }

    function cancelListing() external {
        require(_listed == true, "Listing previously canceled");
        require(_msgSender() == _seller, "Unauthorized");
        uint256 remaining = _availableAmount;
        _availableAmount = 0;
        _listed = false;

        IERC1155(_nft).safeTransferFrom(
            address(this),
            _msgSender(),
            _tokenId,
            remaining,
            ""
        );
    }

    function withdraw() external {
        require(_msgSender() == _seller, "Unauthorized");

        uint256 feeAmount = (_price * IMarket(owner()).fee()) / 10_000;

        payable(owner()).transfer(feeAmount);
        payable(_msgSender()).transfer(address(this).balance - feeAmount);
    }

    function price() external view returns (uint256) {
        return _price;
    }

    function seller() external view returns (address) {
        return _seller;
    }

    function totalAmount() external view returns (uint256) {
        return _totalAmount;
    }

    function availableAmount() external view returns (uint256) {
        return _availableAmount;
    }

    function tokenId() external view returns (uint256) {
        return _tokenId;
    }

    function nftAddress() external view returns (address) {
        return _nft;
    }
}
