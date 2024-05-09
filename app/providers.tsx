"use client";

import { useEffect } from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/style/theme";
import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { http, WagmiProvider, createConfig } from "wagmi";
import {
  mainnet,
  sepolia,
  base,
  optimism,
  arbitrum,
  polygon,
  arbitrumSepolia,
} from "wagmi/chains";
import useInitialization from "@/src/hooks/useInitialization";
import useWalletConnectEventsManager from "@/src/hooks/useWalletConnectEventsManager";
import SettingsStore from "@/src/store/SettingsStore";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import { RELAYER_EVENTS } from "@walletconnect/core";

const appName = "SIWE Smart Accounts";
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, walletConnectWallet, rainbowWallet],
    },
  ],
  { appName, projectId }
);

const config = createConfig({
  connectors,
  chains: [
    mainnet,
    sepolia,
    base,
    optimism,
    arbitrum,
    polygon,
    arbitrumSepolia,
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  // Step 1 - Initialize wallets and wallet connect client
  const initialized = useInitialization();
  SettingsStore.setInitialized(initialized);
  // Step 2 - Once initialized, set up wallet connect event manager
  useWalletConnectEventsManager(initialized);

  useEffect(() => {
    if (!initialized) return;
    web3wallet?.core.relayer.on(RELAYER_EVENTS.connect, () => {
      console.log("Network connection is restored!", "success");
    });

    web3wallet?.core.relayer.on(RELAYER_EVENTS.disconnect, () => {
      console.log("Network connection lost.", "error");
    });
  }, [initialized]);

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme()} modalSize={"compact"}>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
