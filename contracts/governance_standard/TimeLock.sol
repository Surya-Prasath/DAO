// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController{
     constructor(uint256 minDelay, //How long you have to wait before executing
     address[] memory proposers, //List of addresses that can propose
     address[] memory executors) //who can execute when a proposal passes
     TimelockController(minDelay, proposers, executors)
     {}
}
// We want to wait for a new vote to be "ex3cuted"

// Everyone who holds the governance token has to pay 5 tokens

// Give time to users to "get out" if they don't like the governance