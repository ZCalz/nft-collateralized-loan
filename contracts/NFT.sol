// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    uint256 public nextTokenId;
    string public baseURI = "https://tempory-uri.xyz/";

    constructor() ERC721("BasicNFT", "NFT") Ownable(msg.sender) {}

    function mint(address to) external returns (uint256) {
        _mint(to, nextTokenId);
        uint256 minted = nextTokenId;
        nextTokenId++;
        return minted;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory newURI) external onlyOwner {
       baseURI = newURI;
    }
}
