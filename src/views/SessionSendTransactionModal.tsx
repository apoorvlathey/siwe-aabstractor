/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from "react";
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
  Center,
  Stack,
  Spacer,
} from "@chakra-ui/react";
import { CodeBlock, codepen } from "react-code-blocks";

import ModalStore from "@/src/store/ModalStore";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "@/src/utils/EIP155RequestHandlerUtil";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import { EIP155_CHAINS } from "../data/EIP155Data";
import axios from "axios";
import { CopyToClipboard } from "@/components/decoder/CopyToClipboard";
import { stringify } from "viem";
import { renderParams } from "@/components/decoder/renderParams";

export default function SessionSendTransactionModal() {
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  const [decoded, setDecoded] = useState<any>();

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

  useEffect(() => {
    const decodeCalldata = async () => {
      if (chainId) {
        const res = await axios.post(
          "https://swiss-knife.xyz/api/calldata/decoder-recursive",
          {
            address: transaction.to,
            calldata: transaction.data,
            // chainId = eip155:<n>
            chainId: parseInt(chainId.split(":")[1]),
          }
        );
        console.log({ DECODED_RESULT: res.data });
        setDecoded(res.data);
      }
    };

    decodeCalldata();
  }, []);

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
          {/* TODO: have toggle to show raw transaction */}
          {!decoded ? (
            <Box>
              <Text color="whiteAlpha.500">Data:</Text>
              <CodeBlock
                showLineNumbers={false}
                text={JSON.stringify(transaction, null, 2)}
                theme={codepen}
                language="json"
              />
            </Box>
          ) : (
            <Box minW={"80%"}>
              {decoded.functionName &&
              decoded.functionName !== "__abi_decoded__" ? (
                <HStack>
                  <Box>
                    <Box fontSize={"xs"} color={"whiteAlpha.600"}>
                      function
                    </Box>
                    <Box>{decoded.functionName}</Box>
                  </Box>
                  <Spacer />
                  <CopyToClipboard
                    textToCopy={JSON.stringify(
                      {
                        function: decoded.signature,
                        params: JSON.parse(stringify(decoded.rawArgs)),
                      },
                      undefined,
                      2
                    )}
                    labelText={"Copy params"}
                  />
                </HStack>
              ) : null}
              <Stack
                mt={2}
                p={4}
                spacing={4}
                bg={"whiteAlpha.50"}
                rounded={"lg"}
              >
                {decoded.args.map((arg: any, i: number) => {
                  return renderParams(i, arg);
                })}
              </Stack>
            </Box>
          )}
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
