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
    <Box display={"flex"} flexDir={"column"} minHeight="100vh">
      <Box flexGrow={1}>
        <Navbar hideConnectWalletBtn={hideConnectWalletBtn} />
        <Spacer />
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
