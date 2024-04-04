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
import { CodeBlock, codepen } from "react-code-blocks";

import ModalStore from "@/src/store/ModalStore";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "@/src/utils/EIP155RequestHandlerUtil";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import { EIP155_CHAINS } from "../data/EIP155Data";

export default function SessionSendTransactionModal() {
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;

  const topic = requestEvent?.topic;
  const params = requestEvent?.params;
  const chainId = params?.chainId;
  const request = params?.request;
  const transaction = request?.params[0];

  // Ensure request and wallet are defined
  if (!request || !requestSession) {
    return <Text>Missing request data</Text>;
  }

  // Handle approve action
  const onApprove = useCallback(async () => {
    if (requestEvent && topic) {
      setIsLoadingApprove(true);
      try {
        // const response = await approveEIP155Request(requestEvent)
        // await web3wallet.respondSessionRequest({
        //   topic,
        //   response
        // })
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
    if (requestEvent && topic) {
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
      <ModalHeader>Sign a Transaction</ModalHeader>
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
          {chainId ? (
            <Box color="whiteAlpha.500">
              Chain: {EIP155_CHAINS[chainId].name}
            </Box>
          ) : null}
          <Box>
            <Text color="whiteAlpha.500">Data:</Text>
            <CodeBlock
              showLineNumbers={false}
              text={JSON.stringify(transaction, null, 2)}
              theme={codepen}
              language="json"
            />
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
            isDisabled={true}
          >
            Approve
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
}
