// SPDX-License-Identifier: Unlicense 
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name = "Meme Ether";
    string public symbol = "MTH";
    uint256 public decimals = 18;
    uint256 public totalSupply = (10 ** 6) * (10 ** decimals);

    constructor(string memory _name, string memory _symbol, uint256 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
    }
}
