import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { SimpleAccountAPI, HttpRpcClient } from "@account-abstraction/sdk";
import { useEthersSigner, useEthersProvider } from "@/hooks/useEthers";
import { ethers } from "ethers";

const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const factoryAddress = "0x9406Cc6185a346906296840746125a0E44976454";
const bundlerUrl = "https://api.stackup.sh/v1/node/8c1de189cd0a9f38f784d72be9bc243c7c135401809b89a1df4098c2f9d3c26a";

export const useAccountAbstraction = () => {
  const ethersProvider = useEthersProvider();
  const ethersSigner = useEthersSigner();
  const { chain } = useNetwork();
  const [accountAbstraction, setAccountAbstraction] = useState<SimpleAccountAPI>();
  const [bundler, setBundler] = useState<HttpRpcClient>();
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  useEffect(() => {
    if (!ethersProvider) return;
    if (!ethersSigner) return;
    if (!chain) return;
    const walletAPI = new SimpleAccountAPI({
      provider: ethersProvider,
      entryPointAddress,
      owner: ethersSigner,
      factoryAddress,
    });
    const httpRPCClient = new HttpRpcClient(bundlerUrl, entryPointAddress, chain.id);
    setAccountAbstraction(walletAPI);
    setBundler(httpRPCClient);
    walletAPI.getAccountAddress().then((address) => {
      setAddress(address);
      ethersProvider.getBalance(address).then((balance) => {
        setBalance(ethers.utils.formatEther(balance));
      });
    });
  }, [ethersProvider, ethersSigner, chain]);

  return { accountAbstraction, bundler, address, balance };
};
