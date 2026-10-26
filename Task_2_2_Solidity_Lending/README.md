# 2.2 Solidity lending

Hardhat project for part 2.2: a USDT lending contract with fixed 10% interest.
The [root README](../README.md) has the brief, a diagram of the borrow and
repay flow, and the current status, including the contract's known
limitations.

- `contracts/SimpleLending.sol`: `borrow(uint256)` and `repay()`
- `contracts/MockUSDT.sol`: 6-decimal ERC-20 used in place of USDT in the tests
- `test/SimpleLending.test.js`: 11 unit tests against `MockUSDT`
- `scripts/deploy.js`: deploys `SimpleLending` with the mainnet USDT address,
  to the in-process Hardhat network unless you add a network

Requires Node.js 22 or 24. No environment variables are needed.

```shell
npm ci
npx hardhat compile          # npm run compile
npx hardhat test             # npm test
npx hardhat coverage         # npm run coverage
npx hardhat run scripts/deploy.js   # npm run deploy:local
```
