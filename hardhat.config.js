require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/I2h5P8VD34mmnf2GwRaccKZ6UNfk-TNZ",
      accounts: [
        //my exported private key from metamask, you would need to use your own
        "26cabf3e8ced22eb728d43e3ef169a179e4648bea78350f215ee4c2c36f22a59",
      ],
    },
  },
};
