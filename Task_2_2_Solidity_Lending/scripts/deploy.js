const hre = require("hardhat");

async function main() {
    // USDT contract address on Ethereum Mainnet
    const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    // Deploy the SimpleLending contract
    const SimpleLending = await hre.ethers.getContractFactory("SimpleLending");
    const simpleLending = await SimpleLending.deploy(usdtAddress);

    await simpleLending.waitForDeployment();

    console.log(`SimpleLending deployed to ${await simpleLending.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
