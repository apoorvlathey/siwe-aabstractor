import { useRouter } from "next/navigation";
import {
  Center,
  Flex,
  Heading,
  Spacer,
  HStack,
  Image,
  Text,
  Box,
  Link,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Navbar({
  hideConnectWalletBtn,
}: {
  hideConnectWalletBtn?: boolean;
}) {
  const router = useRouter();

  return (
    <Flex py={4} pr={"1rem"} borderBottom="1px" borderColor={"gray.400"}>
      <Spacer />
      <Center flex="1" flexDir={"column"} minW={"80%"}>
        <Heading
          cursor={"pointer"}
          onClick={() => {
            router.push("/");
          }}
        >
          <HStack>
            <Image
              src="/logo-no-bg.png"
              alt="Impersonator logo"
              w="3rem"
              mr="1rem"
            />
            <Text>Impersonator</Text>
          </HStack>
        </Heading>
        {/* <Center>
          <Heading
            mt={2}
            fontSize={20}
            fontStyle={"italic"}
            fontWeight={"light"}
          >
            Connect to dapps as ANY address
          </Heading>
        </Center> */}
      </Center>
      <Flex flex="1" justifyContent="flex-end" alignItems={"center"}>
        <Box pl="1rem">
          <Link
            href={"https://github.com/impersonator-eth/impersonator"}
            isExternal
          >
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
}
