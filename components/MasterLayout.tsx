import React from "react";
import { Box, Spacer } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MasterLayout({
  children,
  hideConnectWalletBtn,
}: {
  children: React.ReactNode;
  hideConnectWalletBtn?: boolean;
}) {
  return (
    <Box minHeight="100vh" position="relative">
      <Navbar hideConnectWalletBtn={hideConnectWalletBtn} />
      <Spacer />
      {children}
      <Footer />
    </Box>
  );
}
