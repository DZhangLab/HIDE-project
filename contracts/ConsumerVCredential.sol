//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// contract to send verifiable credential (issued as NFT) to someone as json

contract VerifiableCredential is ERC721Enumerable, Ownable {

    // Mapping from token ID to credential data
    mapping(uint256 => string) private _tokenData;

    // Constructor initializes the ERC721 token with a name and symbol
    constructor() ERC721("VerifiableCredential", "VC") {}

    // Function to mint a new credential, only callable by the owner
    function mintCredential(address to, string memory jsonCredential) external onlyOwner returns (uint256) {

        // Generate a new token ID by adding one to total supply
        uint256 newTokenId = totalSupply() + 1;

        // Mint the new token (to specified address)
        _safeMint(to, newTokenId);

        // Set the token's data
        _tokenData[newTokenId] = jsonCredential;

        return newTokenId;
    }

    // Function to retrieve the JSON credential data for a given token ID
    function getCredential(uint256 tokenId) external view returns (string memory) {
        return _tokenData[tokenId];
    }
}