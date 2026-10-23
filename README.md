# web3-solidity-algo

Answers to Part 2 of a coding test, written in January 2024:

- **2.1** A Python function that finds two words in a list that concatenate to a target word.
- **2.2** A Solidity lending contract for USDT with fixed 10% interest, in a Hardhat project with unit tests.

The original brief is at the end of this file.

## Contents

| Path | What it is |
| --- | --- |
| `Task_2_1_Algorithm_Programming/task2_1.py` | `solve(wordList, target)` and the four example calls from the brief |
| `Task_2_2_Solidity_Lending/contracts/SimpleLending.sol` | The lending contract: `borrow(uint256)` and `repay()` |
| `Task_2_2_Solidity_Lending/contracts/MockUSDT.sol` | OpenZeppelin ERC-20 with 6 decimals, used in place of USDT in the tests |
| `Task_2_2_Solidity_Lending/test/SimpleLending.test.js` | Three Hardhat unit tests: borrow, debt with interest, repay |
| `Task_2_2_Solidity_Lending/scripts/deploy.js` | Deploys `SimpleLending` with the mainnet USDT address |
| `sweep.yaml`, `.github/ISSUE_TEMPLATE/` | Config for the Sweep AI GitHub app, added by its bot in January 2024 |

## 2.1 Word pair

`solve` checks every ordered pair of list positions `(i, j)` with `i != j` and
returns the first pair whose concatenation equals `target`, or `None`. It is a
brute-force O(n²) search.

```shell
python3 Task_2_1_Algorithm_Programming/task2_1.py
```

Output, which matches the four expected results in the brief:

```
('ab', 'cd')
('cd', 'ab')
None
('ab', 'ab')
```

A word is never paired with itself at the same position. A target made of one
word twice is found only when that word appears twice in the list, as in
example 4; `solve(["ab"], "abab")` returns `None`.

## 2.2 Lending contract

`SimpleLending` takes the token address in its constructor.

- `borrow(amount)` checks that the contract holds at least `amount`, sends
  `amount` to the caller, and adds `amount` plus 10% to the caller's debt in
  `balances`.
- `repay()` pulls the caller's whole recorded debt with `transferFrom` (the
  caller approves the contract first), then sets the debt to zero.
- Both emit an event (`Borrowed`, `Repaid`).

```shell
cd Task_2_2_Solidity_Lending
npm ci
npx hardhat compile
npx hardhat test
```

Hardhat downloads the Solidity compiler on the first compile. Hardhat 2.19
prints an unsupported-version warning on Node 22.

## Status

Finished test code, kept for reference. It has not been audited and is not
meant to hold real funds. Checked on 2026-10-23 with a clean `npm ci` from
`package-lock.json`:

- The Python script runs and prints the expected results.
- The contracts compile. Hardhat builds them with solc 0.8.20, the newest
  compiler in `hardhat.config.js` that satisfies `pragma ^0.8.16`, not the
  0.8.16 the brief named.
- The three Hardhat tests fail before they reach the contract. The test file
  uses the ethers v5 `contract.address` property, and
  `@nomicfoundation/hardhat-toolbox` 4 installs ethers v6, where that property
  is undefined. `scripts/deploy.js` fails the same way on `deployed()`.
- There is no mainnet fork test, and the contract would not work against the
  real USDT. Its `IERC20` interface expects `transfer` and `transferFrom` to
  return a `bool`; mainnet USDT returns nothing, so `borrow` and `repay`
  revert. Only the mock token has been used.
- There is no collateral or borrowing limit. Any address can borrow the whole
  balance, and nothing makes it repay.

## License

GPL-3.0. See [LICENSE](LICENSE).

## Assignment brief

Part 2 had two parts, and the brief invited improvements beyond the stated
requirements.

### 2.1 Algorithm programming

Write a function `solve(wordList, target)` in Python 3 to solve the following
problem.

- Input: a list of distinct strings `wordList`, and a target word `target`.
- Output: return 2 words (not necessarily distinct) that, concatenated, form
  the target word. Any pair is fine if multiple solutions exist. If no pair
  exists, return `None`.

Examples:

1. `wordList = ["ab", "bc", "cd"]`, `target = "abcd"` ⇒ `("ab", "cd")` or `("cd", "ab")`
2. `wordList = ["ab", "bc", "cd"]`, `target = "cdab"` ⇒ `("ab", "cd")` or `("cd", "ab")`
3. `wordList = ["ab", "bc", "cd"]`, `target = "abab"` ⇒ `None`
4. `wordList = ["ab", "ba", "ab"]`, `target = "abab"` ⇒ `("ab", "ab")`

### 2.2 Solidity lending

Write a simple lending contract on USDT in Solidity 0.8.16 on Ethereum
mainnet. USDT contract address: `0xdAC17F958D2ee523a2206206994597C13D831ec7`.

- Assume the contract will initially hold 10 million USDT (someone will
  transfer it).
- Two main functions:
  - `borrow(uint amount)`: the caller borrows `amount` USDT from the contract.
  - `repay()`: the caller repays the borrowed amount plus 10% interest (fixed
    for any period of time).

Any Solidity framework may be used, for example Brownie, Hardhat, Truffle or
Forge.
Include the contract and tests (unit tests and/or a fork test script).
