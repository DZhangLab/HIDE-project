// Deploy script from konoikon
// https://github.com/DZhangLab/HIDe-smart-contracts/blob/main/scripts/user-registry.js
const hre = require("hardhat");

async function main() {
  const NullCheckLib = await hre.ethers.getContractFactory("NullCheck");
  const nullCheckLib = await NullCheckLib.deploy();

  // Deploying the UserRegistry
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry", {
    libraries: {
      NullCheck: nullCheckLib.address,
    },
  });
  const userRegistry = await UserRegistry.deploy();

  // Deploying the ConsumerRegistry
  const ConsumerRegistry = await hre.ethers.getContractFactory(
    "ConsumerRegistry",
    {
      libraries: {
        NullCheck: nullCheckLib.address,
      },
    }
  );
  const consumerRegistry = await ConsumerRegistry.deploy();

  await userRegistry.deployed();
  console.log("User registry deployed to:", userRegistry.address);

  await consumerRegistry.deployed();
  console.log("Consumer registry deployed to:", consumerRegistry.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
