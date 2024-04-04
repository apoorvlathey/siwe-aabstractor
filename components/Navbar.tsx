import { useRouter } from "next/navigation";
import { Center, Flex, Heading, Spacer } from "@chakra-ui/react";

export default function Navbar({
  hideConnectWalletBtn,
}: {
  hideConnectWalletBtn?: boolean;
}) {
  const router = useRouter();

  return (
    <Flex
      pt={"10"}
      pr={"1rem"}
      pb={4}
      borderBottom="1px"
      borderColor={"brand.greenLight"}
    >
      <Spacer />
      <Center flex="1" flexDir={"column"} minW={"80%"}>
        <Heading
          cursor={"pointer"}
          onClick={() => {
            router.push("/");
          }}
        >
          SIWE AAbstractor
        </Heading>
        <Center>
          <Heading
            mt={2}
            fontSize={20}
            fontStyle={"italic"}
            fontWeight={"light"}
          >
            Connect your Smart Accounts to dapps via SIWE (Sign-In With
            Ethereum)
          </Heading>
        </Center>
      </Center>
      <Spacer />
    </Flex>
  );
}
