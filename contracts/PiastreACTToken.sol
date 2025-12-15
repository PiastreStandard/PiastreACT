// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PiastreACTToken is ERC20, Ownable {
    uint256 public immutable maxSupply;

    constructor(address initialOwner)
        ERC20("Piastre ACT", "PACT")
        Ownable(initialOwner)
    {
        maxSupply = 1000 * 10 ** decimals();
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
}