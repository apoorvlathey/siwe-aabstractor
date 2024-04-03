"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/style/theme";
import "@rainbow-me/rainbowkit/styles.css";

import {
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  // the first chain is used by rainbowWallet to determine which chain to use
  [sepolia],
  [
    // NOTE: removing these as getting rate limited by Alchemy
    // jsonRpcProvider({
    //   rpc: (chain) => {
    //     return {
    //       http: process.env.NEXT_PUBLIC_RPC_BASE_URL!,
    //     };
    //   },
    // }),
    // jsonRpcProvider({
    //   rpc: (chain) => {
    //     return {
    //       http: process.env.NEXT_PUBLIC_RPC_GOERLI_URL!,
    //     };
    //   },
    // }),
    publicProvider(),
  ]
);

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme()}
            modalSize={"compact"}
          >
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  );
}
