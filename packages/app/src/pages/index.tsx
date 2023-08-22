import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";

import { useIsConnected } from "@/hooks/useIsConnected";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { useAccountAbstraction } from "@/hooks/useAccountAbstraction";
import { ethers } from "ethers";
import { useEthersProvider } from "@/hooks/useEthers";
import { useContract } from "@/hooks/useContract";
import { credPaymasterAddress } from "@/lib/credPaymaster";
import { sampleEASSchemaId } from "@/lib/eas";
// import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount } from "wagmi";
import { Modal } from "@/components/Modal";
import { useToast } from "@/hooks/useToast";
import ErrorToast from "@/components/ErrorToast";

const inter = Inter({ subsets: ["latin"] });

const CredPaymaster: React.FC = () => {
  const { address } = useAccount();
  const { toast, showToast, hideToast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
  const { accountAbstraction, bundler, accountAbstractionAddress, balance } = useAccountAbstraction();
  const { easContract, attestationSyncContract, credPaymasterContract, paymasterDeposit } = useContract();
  const ethersProvider = useEthersProvider();

  const [mode, setMode] = useState<"ATTESTATION" | "SYNC" | "SPONSOR" | "USER">("ATTESTATION");
  const { isConnected } = useIsConnected();
  const { openConnectModal } = useConnectModal();

  const [toAddress, setToAddress] = useState("0x12c9C2168A0f5991F1eE7BF1d23904702E54A3D9");
  const [attestationId, setAttestationId] = useState(
    "0xfbdaa8f9936d41a3c6791afa8b3acb74a808cd3f77cada5b3be27189b447f891"
  );
  const [schemaId, setSchemaId] = useState(sampleEASSchemaId);
  const [issuerAddress, setIssuerAddress] = useState("");
  const [amount, setAmount] = useState("0.01");

  const [isCreateAttestationModalOpen, setIsCreateAttestationModalOpen] = useState(false);
  const [isSyncAttestationModalOpen, setIsSyncAttestationModalOpen] = useState(false);
  const [syncTxHash, setSyncTxHash] = useState("");
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [sponsorTxHash, setSponsorTxHash] = useState("");
  const [isAccountAbstractionModalOpen, setIsAccountAbstractionModalOpen] = useState(false);
  const [requestId, setRequestId] = useState("");

  const dummyattestationId = "0x0000000000000000000000000000000000000000000000000000000000000001";
  const dummySchemaId = "0x0000000000000000000000000000000000000000000000000000000000000002";
  const dummyAttester = "0x0000000000000000000000000000000000000001";

  useEffect(() => {
    if (!address) return;
    setIssuerAddress(address);
  }, [address]);

  useEffect(() => {
    if (toast) {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, toast.duration - 300); // subtract a bit to ensure the fade out happens before the toast disappears
    }
  }, [toast]);

  const computedClassNames = showAnimation
    ? "opacity-100 transition-opacity duration-300"
    : "opacity-0 transition-opacity duration-300";

  return (
    <div className={`min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 ${inter.className}`}>
      {toast && <ErrorToast className={computedClassNames} message={toast.message} onClose={hideToast} />}
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <header className="text-center">
            <h1 className="text-3xl font-bold mb-2">CredPaymaster</h1>
            <p className="text-sm">Credential-based Transactions Made Easy</p>
          </header>
          <div className="mt-10">
            <div className="mb-4">
              <button
                className={`px-4 py-2 mr-2 ${mode === "ATTESTATION" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                onClick={() => setMode("ATTESTATION")}
              >
                Attestation
              </button>
              <button
                className={`px-4 py-2 mr-2 ${mode === "SYNC" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                onClick={() => setMode("SYNC")}
              >
                Sync
              </button>
              <button
                className={`px-4 py-2 mr-2 ${mode === "SPONSOR" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                onClick={() => setMode("SPONSOR")}
              >
                Sponsor
              </button>
              <button
                className={`px-4 py-2 ${mode === "USER" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                onClick={() => setMode("USER")}
              >
                User
              </button>
            </div>
            {mode === "ATTESTATION" && (
              <div className="attestation-mode">
                <p className="mb-3 text-gray-600">Create a sample attestation.</p>
                <div className="mb-4 bg-gray-50 p-4 rounded border">
                  <h3 className="text-sm font-bold mb-2">Attestation Preview:</h3>
                  <div>
                    <p className="text-gray-600 text-xs mb-1 font-medium">ETHTronto participant</p>
                    <p className="text-gray-600 text-xs">TRUE</p>
                  </div>
                </div>
                <label htmlFor="toAddress" className="block mb-1 text-sm">
                  To Address:
                </label>
                <input
                  id="toAddress"
                  name="toAddress"
                  className="border w-full p-2 rounded mb-6 text-xs"
                  placeholder="Enter destination address"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                />
                {!isConnected && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={async () => {
                        if (!easContract) {
                          showToast({
                            message: "Please make sure your wallet is connected to Optimism Goerli",
                            duration: 3000,
                          });
                          return;
                        }
                        // const schemaEncoder = new SchemaEncoder("bool ETHTrontoParticipant");
                        // console.log("schemaEncoder", schemaEncoder);
                        // const encodedData = schemaEncoder.encodeData([
                        //   { name: "ETHTrontoParticipant", value: true, type: "bool" },
                        // ]);
                        // hardcoded since ethers 0.5.7 can not be used with EAS sdk
                        try {
                          const encodedData = "0x0000000000000000000000000000000000000000000000000000000000000001";
                          console.log("encodedData", encodedData);
                          const tx = await easContract.attest({
                            schema: sampleEASSchemaId,
                            data: {
                              recipient: toAddress,
                              expirationTime: 0 as any,
                              revocable: true,
                              refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                              data: encodedData,
                              value: 0,
                            },
                          });
                          console.log("tx", tx);
                          const receipt = await tx.wait();
                          const attestationId = receipt?.logs[0].data;
                          console.log("attestationId", attestationId);
                          setAttestationId(attestationId);
                          setIsCreateAttestationModalOpen(true);
                        } catch (e: any) {
                          showToast({
                            message: e.message,
                            duration: 3000,
                          });
                        }
                      }}
                    >
                      Submit Attestation
                    </button>
                    <Modal
                      isOpen={isCreateAttestationModalOpen}
                      onClose={() => {
                        setIsCreateAttestationModalOpen(false);
                      }}
                      title="Attestation Created"
                    >
                      <div className="mb-4 bg-gray-50 p-4 rounded border">
                        <div>
                          <p className="text-gray-600 text-xs mb-1 font-medium">Attestation Id</p>
                          <p className="text-gray-600 text-xs">
                            <a
                              className="text-blue-500"
                              href={`https://optimism-goerli-bedrock.easscan.org/attestation/view/${attestationId}`}
                              target="_blank"
                            >
                              {attestationId}
                            </a>
                          </p>
                        </div>
                      </div>
                    </Modal>
                  </>
                )}
              </div>
            )}
            {mode === "SYNC" && (
              <div className="attestation-mode">
                <p className="mb-3 text-gray-600">Sync an attestation from Optimism to Base.</p>
                <label htmlFor="attestationID" className="block mb-1 text-sm">
                  Attestation ID:
                </label>
                <input
                  id="attestationId"
                  name="attestationId"
                  className="border w-full p-2 rounded mb-6 text-xs"
                  placeholder="Enter attestation ID"
                  value={attestationId}
                  onChange={(e) => setAttestationId(e.target.value)}
                />
                {!isConnected && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={async () => {
                        // debug mode
                        // if (!credPaymasterContract) return;
                        // const attestation = {
                        //   uid: attestationId,
                        //   schema: schemaId,
                        //   time: 0,
                        //   expirationTime: 0,
                        //   revocationTime: 0,
                        //   refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                        //   recipient: accountAbstractionAddress,
                        //   attester: address,
                        //   revocable: true,
                        //   data: [],
                        // };
                        // console.log("attestation", attestation);
                        // const tx = await credPaymasterContract.debugAddAttestation(attestationId, attestation);
                        // console.log("tx", tx);
                        // return;
                        if (!attestationSyncContract) {
                          showToast({
                            message: "Please make sure your wallet is connected to Optimism Goerli",
                            duration: 3000,
                          });
                          return;
                        }
                        try {
                          const destinationChainId = "base";
                          const destinationAddress = credPaymasterAddress;
                          const tx = await attestationSyncContract.syncAttestation(
                            destinationChainId,
                            destinationAddress,
                            attestationId,
                            { value: ethers.utils.parseEther("0.001") }
                          );
                          console.log("tx", tx);
                          setSyncTxHash(tx.hash);
                          setIsSyncAttestationModalOpen(true);
                        } catch (e: any) {
                          showToast({
                            message: e.message,
                            duration: 3000,
                          });
                        }
                      }}
                    >
                      Sync Attestation
                    </button>
                    <Modal
                      isOpen={isSyncAttestationModalOpen}
                      onClose={() => {
                        setIsSyncAttestationModalOpen(false);
                      }}
                      title="Sync Attestation Tx Sent"
                    >
                      <div className="mb-4 bg-gray-50 p-4 rounded border">
                        <div>
                          <p className="text-gray-600 text-xs mb-1 font-medium">Transaction Hash</p>
                          <p className="text-gray-600 text-xs">
                            <a
                              className="text-blue-500"
                              href={`https://testnet.axelarscan.io/gmp/${syncTxHash}`}
                              target="_blank"
                            >
                              {syncTxHash}
                            </a>
                          </p>
                        </div>
                      </div>
                    </Modal>
                  </>
                )}
              </div>
            )}
            {mode === "SPONSOR" && (
              <div className="sponsor-mode">
                <p className="mb-3 text-gray-600">Create a sponsorship for an attestation.</p>
                <label htmlFor="schemaId" className="block mb-1 text-sm">
                  Schema ID:
                </label>
                <input
                  id="schemaId"
                  name="schemaId"
                  className="border w-full p-2 rounded mb-3 text-xs"
                  placeholder="Enter attestation ID"
                  value={schemaId}
                  onChange={(e) => setSchemaId(e.target.value)}
                />
                <label htmlFor="issuerAddress" className="block mb-1 text-sm">
                  Issuer Address:
                </label>
                <input
                  id="issuerAddress"
                  name="issuerAdderss"
                  className="border w-full p-2 rounded mb-3 text-xs"
                  placeholder="Enter issuer address"
                  value={issuerAddress}
                  onChange={(e) => setIssuerAddress(e.target.value)}
                />
                <label htmlFor="amount" className="block mb-1 text-sm">
                  Amount (ETH):
                </label>
                <input
                  id="amount"
                  name="amount"
                  className="border w-full p-2 rounded mb-6 text-xs"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {!isConnected && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={async () => {
                        if (!credPaymasterContract) {
                          showToast({
                            message: "Please make sure your wallet is connected to Base Goerli",
                            duration: 3000,
                          });
                          return;
                        }
                        try {
                          // await credPaymasterContract.addStake(1, { value: 1 });
                          const tx = await credPaymasterContract.sponsorAddFund(schemaId, issuerAddress, {
                            value: ethers.utils.parseEther(amount),
                          });
                          console.log("tx", tx);
                          setSponsorTxHash(tx.hash);
                          setIsSponsorModalOpen(true);
                        } catch (e: any) {
                          showToast({
                            message: e.message,
                            duration: 3000,
                          });
                        }
                      }}
                    >
                      Submit Sponsorship
                    </button>
                    <Modal
                      isOpen={isSponsorModalOpen}
                      onClose={() => {
                        setIsSponsorModalOpen(false);
                      }}
                      title="Sync Attestation Tx Sent"
                    >
                      <div className="mb-4 bg-gray-50 p-4 rounded border">
                        <div>
                          <p className="text-gray-600 text-xs mb-1 font-medium">Transaction Hash</p>
                          <p className="text-gray-600 text-xs">
                            <a
                              className="text-blue-500"
                              href={`https://goerli.basescan.org/tx/${sponsorTxHash}`}
                              target="_blank"
                            >
                              {sponsorTxHash}
                            </a>
                          </p>
                        </div>
                      </div>
                    </Modal>
                  </>
                )}
              </div>
            )}
            {mode === "USER" && (
              <div className="user-mode">
                <p className="mb-3 text-gray-600">Create a sponsored tx with an attestation.</p>
                <div className="mb-4 bg-gray-50 p-4 rounded border">
                  <h3 className="text-sm font-bold mb-2">Account Abstraction Wallet:</h3>
                  <div>
                    <p className="text-gray-600 text-xs mb-1 font-medium">Address</p>
                    <p className="text-gray-600 text-xs mb-2">{accountAbstractionAddress}</p>
                    <p className="text-gray-600 text-xs mb-1 font-medium">Balance</p>
                    <p className="text-gray-600 text-xs">{balance}</p>
                  </div>
                </div>
                <div className="mb-4 bg-gray-50 p-4 rounded border">
                  <h3 className="text-sm font-bold mb-2">Cred Paymster:</h3>
                  <div>
                    <p className="text-gray-600 text-xs mb-1 font-medium">Address</p>
                    <p className="text-gray-600 text-xs mb-2">{credPaymasterContract?.address}</p>
                    <p className="text-gray-600 text-xs mb-1 font-medium">Balance</p>
                    <p className="text-gray-600 text-xs">{paymasterDeposit}</p>
                  </div>
                </div>
                <div className="mb-4 bg-gray-50 p-4 rounded border">
                  <h3 className="text-sm font-bold mb-2">Transaction Preview:</h3>
                  <div>
                    <p className="text-gray-600 text-xs mb-1 font-medium">To</p>
                    <p className="text-gray-600 text-xs mb-2">{ethers.constants.AddressZero}</p>
                    <p className="text-gray-600 text-xs mb-1 font-medium">Data</p>
                    <p className="text-gray-600 text-xs">0x</p>
                  </div>
                </div>
                <label htmlFor="attestationId" className="block mb-1 text-sm">
                  Attestation ID:
                </label>
                <input
                  id="attestationId"
                  name="attestationId"
                  className="border w-full p-2 rounded mb-3 text-xs"
                  placeholder="Enter attestation ID"
                  value={attestationId}
                  onChange={(e) => setAttestationId(e.target.value)}
                />
                {!isConnected && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={async () => {
                        if (!accountAbstraction || !bundler || !ethersProvider) {
                          showToast({
                            message: "Please make sure your wallet is connected to Base Goerli",
                            duration: 3000,
                          });
                          return;
                        }
                        try {
                          const unSignedUserOp = await accountAbstraction.createUnsignedUserOp({
                            target: ethers.constants.AddressZero,
                            data: "0x",
                          });
                          unSignedUserOp.preVerificationGas = 500000;
                          unSignedUserOp.paymasterAndData = credPaymasterAddress + attestationId.slice(2);
                          console.log("unSignedUserOp", unSignedUserOp);
                          const userOp = await accountAbstraction.signUserOp(unSignedUserOp);
                          console.log("userOp", userOp);
                          const result = await bundler.sendUserOpToBundler(userOp);
                          console.log("result", result);
                          setRequestId(result);
                          setIsAccountAbstractionModalOpen(true);
                        } catch (e: any) {
                          showToast({
                            message: e.message,
                            duration: 3000,
                          });
                        }
                      }}
                    >
                      Send Transaction
                    </button>
                    <Modal
                      isOpen={isAccountAbstractionModalOpen}
                      onClose={() => {
                        setIsAccountAbstractionModalOpen(false);
                      }}
                      title="Account Abstraction Tx Sent"
                    >
                      <div className="mb-4 bg-gray-50 p-4 rounded border">
                        <div>
                          <p className="text-gray-600 text-xs mb-1 font-medium">Request Id</p>
                          <p className="text-gray-600 text-xs">
                            <a
                              className="text-blue-500"
                              href={`https://www.jiffyscan.xyz/userOpHash/${requestId}?network=base-testnet`}
                              target="_blank"
                            >
                              {requestId}
                            </a>
                          </p>
                        </div>
                      </div>
                    </Modal>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredPaymaster;
