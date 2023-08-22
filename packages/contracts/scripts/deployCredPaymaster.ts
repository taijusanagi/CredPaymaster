import { ethers } from "hardhat";

// should be run on Base Goerli
async function main() {
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const gatewayAddress = "0xe432150cce91c13a887f7D836923d5597adD8E31";
  const sourceChain = "optimism";
  // should change to the deployed attestation sync address
  const attestationSyncAddress = "0x0E2487584BE1c002654ccFfE17d6391a88C1e72A";
  const CredPaymaster = await ethers.getContractFactory("CredPaymaster");
  const credPaymaster = await CredPaymaster.deploy(
    entryPointAddress,
    gatewayAddress,
    sourceChain,
    attestationSyncAddress,
  );
  await credPaymaster.deployed();
  console.log(`Deployed to ${credPaymaster.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
