import { ethers } from "hardhat";

async function main() {
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const CredPaymaster = await ethers.getContractFactory("CredPaymaster");
  const credPaymaster = await CredPaymaster.deploy(entryPointAddress);
  await credPaymaster.deployed();
  console.log(`Deployed to ${credPaymaster.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
