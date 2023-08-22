import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useEthersSigner } from "@/hooks/useEthers";
import { credPaymasterAbi, credPaymasterAddress } from "@/lib/credPaymaster";
import { easAbi, easAddress } from "@/lib/eas";
import { attestationSyncAbi, attestationSyncAddress } from "@/lib/attestationSync";
import { useNetwork } from "wagmi";

export const useContract = () => {
  const { chain } = useNetwork();
  const [easContract, setEASContract] = useState<Contract>();
  const [attestationSyncContract, setAttestationSyncContract] = useState<Contract>();
  const [credPaymasterContract, setCredPaymasterContract] = useState<Contract>();

  const [paymasterDeposit, setPaymasterDeposit] = useState("0");

  const ethersSigner = useEthersSigner();
  useEffect(() => {
    if (!ethersSigner) return;
    if (!chain) return;
    if (chain.id === 420) {
      const easContract = new Contract(easAddress, easAbi, ethersSigner);
      setEASContract(easContract);
      const attestationSyncContract = new Contract(attestationSyncAddress, attestationSyncAbi, ethersSigner);
      setAttestationSyncContract(attestationSyncContract);
      setCredPaymasterContract(undefined);
    } else if (chain.id === 84531) {
      const credPaymasterContract = new Contract(credPaymasterAddress, credPaymasterAbi, ethersSigner);
      setCredPaymasterContract(credPaymasterContract);
      credPaymasterContract.getDeposit().then((deposit: number) => {
        setPaymasterDeposit(ethers.utils.formatEther(deposit));
      });
      setEASContract(undefined);
      setAttestationSyncContract(undefined);
    }
  }, [chain, ethersSigner]);
  return { easContract, attestationSyncContract, credPaymasterContract, paymasterDeposit };
};
