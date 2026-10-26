require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      // first entry is what hardhat-gas-reporter prints; builds still pick the newest match
      {
        version: "0.8.20"
      },
      {
        version: "0.8.16"
      }
    ]
  },
};
