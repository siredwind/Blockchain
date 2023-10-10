pragma solidity 0.8.19;

contract Greeter {
    string value;

    constructor() {
        value = "Hello World! This is my first Smart Contract";
    }

    function get() public view returns(string memory) {
        return value;
    }

    function set(string memory _value) public {
        value = _value;
    }
}