import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useEthersSigner } from "@/hooks/useEthers";
import { credPaymasterAbi, credPaymasterAddress } from "@/lib/credPaymaster";

export const useCredPaymasterContract = () => {
  const [credPaymasterContract, setCredPaymasterContract] = useState<Contract>();
  const [deposit, setDeposit] = useState("0");

  const ethersSigner = useEthersSigner();
  useEffect(() => {
    if (!ethersSigner) return;
    const credPaymasterContract = new Contract(credPaymasterAddress, credPaymasterAbi, ethersSigner);
    setCredPaymasterContract(credPaymasterContract);
    credPaymasterContract.getDeposit().then((deposit: number) => {
      setDeposit(ethers.utils.formatEther(deposit));
    });
  }, [ethersSigner]);
  return { credPaymasterContract, deposit };
};
