// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public tokensSold;
    uint256 public maxTokens;
    uint256 public openTime;

    mapping(address => bool) public whitelist;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokensSold, uint256 ethRaised);

    constructor(Token _token, uint256 _price, uint256 _maxTokens, uint256 _openTime) {
        owner = msg.sender;
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
        openTime = _openTime;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Address is not whitelisted");
        _;
    }

    receive() external payable {
        uint256 amount = msg.value / price;
        buyTokens(amount * 1e18);
    }

    function buyTokens(uint256 _amount) public payable onlyWhitelisted {
        require(block.timestamp >= openTime, "Buying tokens is not allowed yet");

        require(msg.value == (_amount / 1e18) * price, "Incorrect ETH amount");

        require(token.balanceOf(address(this)) >= _amount, "Not enough tokens left for purchase");
        require(_amount >= 1 * 1e18, "Minimum purchase amount is 1");
        require(_amount <= 1000 * 1e18, "Maximum purchase amount is 1000");

        require(token.transfer(msg.sender, _amount));

        tokensSold += _amount;

        emit Buy(_amount, msg.sender);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function finalize() public onlyOwner {
        require(token.transfer(owner, token.balanceOf(address(this))));

        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value: value}("");
        require(sent);

        emit Finalize(tokensSold, value);
    }

    function addToWhitelist(address _user) public onlyOwner {
        whitelist[_user] = true;
    }

    function removeFromWhitelist(address user) public onlyOwner {
        delete whitelist[user];
    }

    function setOpenTime(uint256 _openTime) public onlyOwner {
        openTime = _openTime;
    }
}
