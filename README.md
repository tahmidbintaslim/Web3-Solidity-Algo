## Part 2) Please read the problem statement carefully and write a program that correctly solves it. TIPS: You can also suggest/implement any improvement that you think it’s better to have. GL :) There will be 2 parts

### 2.1) Algorithm Programming
### 2.2) Solidity Lending.

#### 2.1) Algorithm Programming
Write a function solve(wordList, target) in Python3 to solve the following problem:

- Input:
- A list of distinct strings wordList
- Target word target
- Output:
- Return 2 words (not necessarily distinct) that combined (concatenated) to the
target word. (Any pair is fine if multiple solutions exist).
- If no pair exists, return None.

Examples:

1. wordList = [“ab”, “bc”, “cd”], target = “abcd”
⇒ output = (“ab”, “cd”) or (“cd”, “ab”)
2. wordList = [“ab”, “bc”, “cd”], target = “cdab”
⇒ output = (“ab”, “cd”) or (“cd”, “ab”)
3. wordList = [“ab”, “bc”, “cd”], target = “abab”
⇒ output = None
4. wordList = [“ab”, “ba”, “ab”], target = “abab”
⇒ output = (“ab”, “ab”)

#### 2.2) Solidity Lending
Write a simple lending contract on USDT in Solidity 0.8.16 on Ethereum mainnet.
USDT contract address: 0xdAC17F958D2ee523a2206206994597C13D831ec7

- Assume the contract will initially hold 10 million USDT. (someone will transfer to it).
- Two main functionalities:
- borrow(uint amount) - the caller borrows USDT amount from the contract
- repay() - the caller repays the borrowed amount + 10% interest (fixed for any
period of time)

You can use any Solidity dev framework e.g. brownie, hardhat, truffle, forge. Please include the
contract and testing (can be unit test and/or fork test script).