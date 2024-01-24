// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SimpleLending {
    IERC20 public usdt;
    address public owner;
    mapping(address => uint256) public balances;
    uint256 constant INTEREST_RATE = 10; // 10% interest rate

    event Borrowed(address borrower, uint256 amount);
    event Repaid(address borrower, uint256 amount);

    constructor(address _usdtAddress) {
        usdt = IERC20(_usdtAddress);
        owner = msg.sender;
    }

    function borrow(uint256 amount) public {
        require(usdt.balanceOf(address(this)) >= amount, "Insufficient funds in contract");
        usdt.transfer(msg.sender, amount);
        balances[msg.sender] += amount + ((amount * INTEREST_RATE) / 100);

        emit Borrowed(msg.sender, amount);
    }

    function repay() public {
        uint256 owed = balances[msg.sender];
        require(owed > 0, "No debt to repay");
        usdt.transferFrom(msg.sender, address(this), owed);
        balances[msg.sender] = 0;

        emit Repaid(msg.sender, owed);
    }
}
