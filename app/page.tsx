"use client";
export const runtime = "nodejs";

import { useEffect } from "react";
import { Center } from "@chakra-ui/react";
import MasterLayout from "@/components/MasterLayout";

import useInitialization from "@/src/hooks/useInitialization";
import useWalletConnectEventsManager from "@/src/hooks/useWalletConnectEventsManager";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import { RELAYER_EVENTS } from "@walletconnect/core";
import WalletConnect from "@/components/WalletConnect";
import Modal from "@/components/Modal";
import AddressInput from "@/components/AddressInput";

export default function Home() {
  // Step 1 - Initialize wallets and wallet connect client
  const initialized = useInitialization();
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
    <MasterLayout hideConnectWalletBtn={false}>
      <Center flexDir={"column"} mt={"3rem"}>
        <AddressInput />
        <WalletConnect initialized={initialized} />
      </Center>

      <Modal />
    </MasterLayout>
  );
}
