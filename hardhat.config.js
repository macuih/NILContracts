require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    artifacts: "./src/artifacts", 
  },
  networks: {
    localhost: {
      url: "http://ec2-3-144-201-231.us-east-2.compute.amazonaws.com:8545", 
      chainId: 1337, 
    },
    hardhat: {
      chainId: 1337,
    },
  },
  solidity: "0.8.18",
};
