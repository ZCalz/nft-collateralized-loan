// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LoanToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("LoanToken", "LTKN") {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(uint256 amount) external { // only for testing purposes (normally only owner can burn their own tokens)
        _burn(msg.sender, amount);
    }
}