// SPDX-License-Identifier: MIT
pragma solidity >=0.8 <0.9.0;

contract SimpleStorage {
    uint _storedData;

    function store(uint x) public {
        _storedData = x;
    }

    function retrieve() public view returns (uint) {
        return _storedData;
    }
}
