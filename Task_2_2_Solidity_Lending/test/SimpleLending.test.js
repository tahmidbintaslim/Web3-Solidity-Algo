const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// MockUSDT has 6 decimals, like USDT. Amounts are bigint (ethers v6).
const usdt = (amount) => ethers.parseUnits(String(amount), 6);

const POOL = usdt(10_000_000); // the brief: the contract starts with 10 million USDT
const BORROW = usdt(1_000);
const INTEREST = BORROW / 10n; // fixed 10%

describe("SimpleLending", function () {
  async function deploySimpleLendingFixture() {
    const [owner, borrower] = await ethers.getSigners();

    // The owner keeps 1,000 mUSDT beyond the pool to hand borrowers their interest.
    const token = await ethers.deployContract("MockUSDT", [POOL + usdt(1_000)]);
    const lending = await ethers.deployContract("SimpleLending", [
      await token.getAddress(),
    ]);
    await token.transfer(await lending.getAddress(), POOL);

    return { lending, token, owner, borrower };
  }

  describe("Deployment", function () {
    it("stores the token address and starts with the 10M pool", async function () {
      const { lending, token } = await loadFixture(deploySimpleLendingFixture);

      expect(await lending.usdt()).to.equal(await token.getAddress());
      expect(await token.balanceOf(await lending.getAddress())).to.equal(POOL);
    });
  });

  describe("Borrowing", function () {
    it("should allow a user to borrow USDT", async function () {
      const { lending, token, borrower } = await loadFixture(deploySimpleLendingFixture);

      await expect(lending.connect(borrower).borrow(BORROW)).to.changeTokenBalances(
        token,
        [borrower, lending],
        [BORROW, -BORROW],
      );
    });

    it("should record the debt with interest", async function () {
      const { lending, borrower } = await loadFixture(deploySimpleLendingFixture);

      await lending.connect(borrower).borrow(BORROW);

      expect(await lending.balances(borrower.address)).to.equal(BORROW + INTEREST);
    });

    it("adds a second loan to the existing debt", async function () {
      const { lending, borrower } = await loadFixture(deploySimpleLendingFixture);

      await lending.connect(borrower).borrow(BORROW);
      await lending.connect(borrower).borrow(BORROW);

      expect(await lending.balances(borrower.address)).to.equal(2n * (BORROW + INTEREST));
    });

    it("emits Borrowed with the borrower and the amount", async function () {
      const { lending, borrower } = await loadFixture(deploySimpleLendingFixture);

      await expect(lending.connect(borrower).borrow(BORROW))
        .to.emit(lending, "Borrowed")
        .withArgs(borrower.address, BORROW);
    });

    it("reverts when the contract holds less than the amount", async function () {
      const { lending, borrower } = await loadFixture(deploySimpleLendingFixture);

      await expect(lending.connect(borrower).borrow(POOL + 1n)).to.be.revertedWith(
        "Insufficient funds in contract",
      );
    });
  });

  describe("Repaying", function () {
    it("should allow a user to repay the borrowed USDT with interest", async function () {
      const { lending, token, borrower } = await loadFixture(deploySimpleLendingFixture);

      await lending.connect(borrower).borrow(BORROW);
      // The borrower only received BORROW, so give them the interest to pay back.
      await token.transfer(borrower.address, INTEREST);
      await token.connect(borrower).approve(await lending.getAddress(), BORROW + INTEREST);

      await expect(lending.connect(borrower).repay()).to.changeTokenBalances(
        token,
        [borrower, lending],
        [-(BORROW + INTEREST), BORROW + INTEREST],
      );
      expect(await lending.balances(borrower.address)).to.equal(0n);
    });

    it("emits Repaid with the borrower and the amount owed", async function () {
      const { lending, token, borrower } = await loadFixture(deploySimpleLendingFixture);

      await lending.connect(borrower).borrow(BORROW);
      await token.transfer(borrower.address, INTEREST);
      await token.connect(borrower).approve(await lending.getAddress(), BORROW + INTEREST);

      await expect(lending.connect(borrower).repay())
        .to.emit(lending, "Repaid")
        .withArgs(borrower.address, BORROW + INTEREST);
    });

    it("reverts when the caller has no debt", async function () {
      const { lending, borrower } = await loadFixture(deploySimpleLendingFixture);

      await expect(lending.connect(borrower).repay()).to.be.revertedWith("No debt to repay");
    });

    it("reverts when the caller has not approved the full debt", async function () {
      const { lending, token, borrower } = await loadFixture(deploySimpleLendingFixture);

      await lending.connect(borrower).borrow(BORROW);
      await token.transfer(borrower.address, INTEREST);
      await token.connect(borrower).approve(await lending.getAddress(), BORROW);

      await expect(lending.connect(borrower).repay()).to.be.revertedWithCustomError(
        token,
        "ERC20InsufficientAllowance",
      );
      expect(await lending.balances(borrower.address)).to.equal(BORROW + INTEREST);
    });
  });
});
