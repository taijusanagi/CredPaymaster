import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { AppProps } from "next/app";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { optimismGoerli, baseGoerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains([optimismGoerli, baseGoerli], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "CredPaymaster",
  projectId: "CRED_PAYMASTER",
  chains,
});

const wagmiConfig = createConfig({
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />{" "}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
