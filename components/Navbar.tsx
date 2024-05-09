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
          Impersonator
        </Heading>
      </Center>
      <Spacer />
    </Flex>
  );
}
