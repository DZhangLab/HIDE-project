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

  await userRegistry.deployed();
  console.log("User registry deployed to:", userRegistry.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
