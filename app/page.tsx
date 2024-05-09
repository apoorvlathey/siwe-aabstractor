"use client";
export const runtime = "nodejs";

import { useState } from "react";
import { Container } from "@chakra-ui/react";
import MasterLayout from "@/components/MasterLayout";

import WalletConnect from "@/components/WalletConnect";
import Modal from "@/components/Modal";

import AddressInput from "@/components/AddressInput";

export default function Home() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isIFrameLoading, setIsIFrameLoading] = useState(false);
  const [isEIP155AddressValid, setIsEIP155AddressValid] = useState(true);
  // FIXME: these
  const [isConnected, setIsConnected] = useState(false);
  const appUrl = "";
  const updateAddress = () => {};

  return (
    <MasterLayout hideConnectWalletBtn={false}>
      <Container mt="10" mb="16" minW={["0", "0", "2xl", "2xl"]}>
        <AddressInput
          selectedTabIndex={selectedTabIndex}
          isConnected={isConnected}
          appUrl={appUrl}
          isIFrameLoading={isIFrameLoading}
          updateAddress={updateAddress}
          isEIP155AddressValid={isEIP155AddressValid}
          setIsEIP155AddressValid={setIsEIP155AddressValid}
        />
        <WalletConnect setIsEIP155AddressValid={setIsEIP155AddressValid} />
      </Container>

      <Modal />
    </MasterLayout>
  );
}
