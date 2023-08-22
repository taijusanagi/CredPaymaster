import { ethers } from "hardhat";

// should be run on Optimism Goerli
async function main() {
  const easAddress = "0x4200000000000000000000000000000000000021";
  const gatewayAddress = "0xe432150cce91c13a887f7D836923d5597adD8E31";
  const gasServiceAddress = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";

  const AttestationSync = await ethers.getContractFactory("AttestationSync");
  const attestationSync = await AttestationSync.deploy(easAddress, gatewayAddress, gasServiceAddress);
  await attestationSync.deployed();
  console.log(`Deployed to ${attestationSync.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
