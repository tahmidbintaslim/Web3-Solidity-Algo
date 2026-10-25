# 2.2 Solidity lending

Hardhat project for part 2.2: a USDT lending contract with fixed 10% interest.
The [root README](../README.md) has the brief and the current status.

- `contracts/SimpleLending.sol`: `borrow(uint256)` and `repay()`
- `contracts/MockUSDT.sol`: 6-decimal ERC-20 used in place of USDT in the tests
- `test/SimpleLending.test.js`: unit tests against `MockUSDT`
- `scripts/deploy.js`: deploys `SimpleLending` with the mainnet USDT address

```shell
npm ci
npx hardhat compile
npx hardhat test
```

The tests currently fail: they use ethers v5 APIs, and
`@nomicfoundation/hardhat-toolbox` 4 installs ethers v6.
