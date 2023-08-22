import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    base: {
      url: "https://goerli.base.org",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
