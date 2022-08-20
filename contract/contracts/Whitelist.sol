// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log
// import "hardhat/console.sol";

contract Whitelist {
    // max number of whitelisted addresses allowed
    uint public maxWhitelistAddresses;

    // if an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) public whitelistedAddresses;

    uint8 public numAddressesWhitelisted = 0;

    // max number of whitelisted address
    constructor (uint _maxWhitelistAddresses){
        maxWhitelistAddresses = _maxWhitelistAddresses;
    }

    function addToWhitelist() public {
        // check if user has already been whitelisted
        require(!whitelistedAddresses[msg.sender], "User has already been whitelisted!!");
        // check that number of addresses whitelisted is kess than maximum addresses we want to whitelist
        require(numAddressesWhitelisted < maxWhitelistAddresses, "Maximum wallets reached, you can't whitelist anymore!!");
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted + 1;
    }
}