import React, { useState } from "react";
import { Inter } from "next/font/google";

import { useIsConnected } from "@/hooks/useIsConnected";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { useAccountAbstraction } from "@/hooks/useAccountAbstraction";
import { ethers } from "ethers";
import { useEthersProvider } from "@/hooks/useEthers";
import { useCredPaymasterContract } from "@/hooks/useCredPaymasterContract";
import { credPaymasterAddress } from "@/lib/credPaymaster";

const inter = Inter({ subsets: ["latin"] });

const CredPaymaster: React.FC = () => {
  const { accountAbstraction, bundler, address, balance } = useAccountAbstraction();
  const { credPaymasterContract, deposit } = useCredPaymasterContract();
  const ethersProvider = useEthersProvider();

  const [mode, setMode] = useState<"ATTESTATION" | "SYNC" | "SPONSOR" | "USER">("ATTESTATION");
  const { isConnected } = useIsConnected();
  const { openConnectModal } = useConnectModal();

  const dummyAttestaionId = "0x0000000000000000000000000000000000000000000000000000000000000001";
  const dummySchemaId = "0x0000000000000000000000000000000000000000000000000000000000000002";
  const dummyAttester = "0x0000000000000000000000000000000000000001";

  return (
    <div className={`min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 ${inter.className}`}>
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
                  className="border w-full p-2 rounded mb-6"
                  placeholder="Enter destination address"
                />
                {!isConnected && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      console.log("submit attestation");
                    }}
                  >
                    Submit Attestation
                  </button>
                )}
              </div>
            )}
            {mode === "SYNC" && (
              <div className="attestation-mode">
                <p className="mb-3 text-gray-600">Sync an attestation between Optimism and Base.</p>
                <label htmlFor="attestationID" className="block mb-1 text-sm">
                  Attestation ID:
                </label>
                <input
                  id="attestationId"
                  name="attestationId"
                  className="border w-full p-2 rounded mb-6"
                  placeholder="Enter attestation ID"
                />
                {!isConnected && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      if (!credPaymasterContract) return;
                      const attestation = {
                        uid: dummyAttestaionId,
                        schema: dummySchemaId,
                        time: 0,
                        expirationTime: 0,
                        revocationTime: 0,
                        refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                        recipient: "0x0000000000000000000000000000000000000000",
                        attester: dummyAttester,
                        revocable: true,
                        data: [],
                      };
                      const tx = await credPaymasterContract.syncAttestation(dummyAttestaionId, attestation);
                      console.log("tx", tx);
                    }}
                  >
                    Sync Attestation
                  </button>
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
                  className="border w-full p-2 rounded mb-3"
                  placeholder="Enter attestation ID"
                />
                <label htmlFor="issuerAddress" className="block mb-1 text-sm">
                  Issuer Address:
                </label>
                <input
                  id="issuerAddress"
                  name="issuerAdderss"
                  className="border w-full p-2 rounded mb-3"
                  placeholder="Enter issuer address"
                />
                <label htmlFor="amount" className="block mb-1 text-sm">
                  Amount:
                </label>
                <input
                  id="amount"
                  name="amount"
                  className="border w-full p-2 rounded mb-6"
                  placeholder="Enter amount"
                />
                {!isConnected && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      if (!credPaymasterContract) return;

                      // await credPaymasterContract.addStake(1, { value: 1 });
                      const tx = await credPaymasterContract.sponsorAddFund(dummySchemaId, dummyAttester, {
                        value: ethers.utils.parseEther("0.01"),
                      });
                      console.log("tx", tx);
                    }}
                  >
                    Submit Sponsorship
                  </button>
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
                    <p className="text-gray-600 text-xs mb-2">{address}</p>
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
                    <p className="text-gray-600 text-xs">{deposit}</p>
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
                  className="border w-full p-2 rounded mb-3"
                  placeholder="Enter attestation ID"
                />
                {!isConnected && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      if (!accountAbstraction) return;
                      if (!bundler) return;
                      if (!ethersProvider) return;
                      const unSignedUserOp = await accountAbstraction.createUnsignedUserOp({
                        target: ethers.constants.AddressZero,
                        data: "0x",
                      });
                      unSignedUserOp.preVerificationGas = 500000;
                      unSignedUserOp.paymasterAndData = credPaymasterAddress + dummyAttestaionId.slice(2);
                      console.log("unSignedUserOp", unSignedUserOp);
                      const userOp = await accountAbstraction.signUserOp(unSignedUserOp);
                      console.log("userOp", userOp);
                      const result = await bundler.sendUserOpToBundler(userOp);
                      console.log("result", result);
                    }}
                  >
                    Send Transaction
                  </button>
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
