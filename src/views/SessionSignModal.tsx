/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Textarea,
  Center,
} from "@chakra-ui/react";

import { useConfig } from "wagmi";
import { signMessage } from "wagmi/actions";

import ModalStore from "@/src/store/ModalStore";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "@/src/utils/EIP155RequestHandlerUtil";
import { getSignParamsMessage } from "@/src/utils/HelperUtil";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import { EIP155_CHAINS } from "../data/EIP155Data";

export default function SessionSignModal() {
  const config = useConfig();

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <Text>Missing request data</Text>;
  }

  // Get required request data
  const { topic, params } = requestEvent;
  const { request, chainId } = params;

  // Get message, convert it to UTF8 string if it is valid hex
  const message = getSignParamsMessage(request.params);

  const signMsg = useCallback(
    async (msg: string) => {
      const signature = await signMessage(config, {
        message: msg,
      });
      return signature;
    },
    [config]
  );

  // Handle approve action (logic varies based on request method)
  const onApprove = useCallback(async () => {
    if (requestEvent) {
      setIsLoadingApprove(true);
      const response = await approveEIP155Request(requestEvent, signMsg);
      try {
        await web3wallet.respondSessionRequest({
          topic,
          response,
        });
      } catch (e) {
        setIsLoadingApprove(false);
        console.log((e as Error).message, "error");
        return;
      }
      setIsLoadingApprove(false);
      ModalStore.close();
    }
  }, [requestEvent, topic]);

  // Handle reject action
  const onReject = useCallback(async () => {
    if (requestEvent) {
      setIsLoadingReject(true);
      const response = rejectEIP155Request(requestEvent);
      try {
        await web3wallet.respondSessionRequest({
          topic,
          response,
        });
      } catch (e) {
        setIsLoadingReject(false);
        console.log((e as Error).message, "error");
        return;
      }
      setIsLoadingReject(false);
      ModalStore.close();
    }
  }, [requestEvent, topic]);

  const { icons, name, url } = requestSession.peer.metadata;

  return (
    <ModalContent bg={"gray.900"}>
      <ModalHeader>Request a Signature</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Center>
          <Avatar src={icons[0]} mr="2rem" />
          <Box>
            <Text>{name}</Text>
            <Text color={"whiteAlpha.600"}>{url}</Text>
          </Box>
        </Center>
        <Container mt="1rem">
          <Box color="whiteAlpha.500">
            Chain:{" "}
            {EIP155_CHAINS[chainId] ? EIP155_CHAINS[chainId].name : chainId}
          </Box>
          <Box>
            <Text color="whiteAlpha.500">Message:</Text>
            <Textarea minH="15rem" disabled>
              {message}
            </Textarea>
          </Box>
        </Container>
      </ModalBody>
      <ModalFooter>
        <HStack>
          <Button
            onClick={() => onReject()}
            isLoading={isLoadingReject}
            colorScheme={"red"}
          >
            Reject
          </Button>
          <Button
            onClick={() => onApprove()}
            isLoading={isLoadingApprove}
            colorScheme={"green"}
          >
            Approve
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
}
