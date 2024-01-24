const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleLending", function () {
    async function deploySimpleLendingFixture() {
        const [owner, borrower] = await ethers.getSigners();

        const MockUSDT = await ethers.getContractFactory("MockUSDT");
        const usdt = await MockUSDT.deploy(10000000 * 10 ** 6);
        console.log("MockUSDT address:", usdt.address);

        const SimpleLending = await ethers.getContractFactory("SimpleLending");
        const simpleLending = await SimpleLending.deploy(usdt.address);
        console.log("SimpleLending address:", simpleLending.address);

        await usdt.transfer(simpleLending.address, 10000000 * 10 ** 6);

        return { simpleLending, usdt, owner, borrower };
    }

    describe("Borrowing", function () {
        it("should allow a user to borrow USDT", async function () {
            const { simpleLending, usdt, borrower } = await deploySimpleLendingFixture();
            // Manually calculate the borrow amount (1000 USDT with 6 decimals)
            const borrowAmount = 1000 * 10 ** 6;

            await simpleLending.connect(borrower).borrow(borrowAmount);

            const borrowerBalance = await usdt.balanceOf(borrower.address);
            expect(borrowerBalance.toString()).to.equal(borrowAmount.toString());
        });

        it("should record the debt with interest", async function () {
            const { simpleLending, borrower } = await deploySimpleLendingFixture();
            // Manually calculate the borrow amount (1000 USDT with 6 decimals)
            const borrowAmount = 1000 * 10 ** 6;

            await simpleLending.connect(borrower).borrow(borrowAmount);

            const debt = await simpleLending.balances(borrower.address);
            const expectedDebt = borrowAmount + (borrowAmount / 10); // 10% interest
            expect(debt.toString()).to.equal(expectedDebt.toString());
        });
    });

    describe("Repaying", function () {
        it("should allow a user to repay the borrowed USDT with interest", async function () {
            const { simpleLending, usdt, borrower } = await deploySimpleLendingFixture();
            // Manually calculate the borrow amount (1000 USDT with 6 decimals)
            const borrowAmount = 1000 * 10 ** 6;

            await simpleLending.connect(borrower).borrow(borrowAmount);
            const interest = borrowAmount / 10;
            await usdt.connect(borrower).approve(simpleLending.address, borrowAmount + interest);
            await simpleLending.connect(borrower).repay();

            const borrowerDebt = await simpleLending.balances(borrower.address);
            expect(borrowerDebt.toString()).to.equal('0');
        });
    });
});
