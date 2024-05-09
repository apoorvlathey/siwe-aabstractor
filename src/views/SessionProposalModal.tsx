import { useCallback, useMemo, useState, useEffect } from "react";
import {
  Alert,
  Avatar,
  Button,
  Box,
  Center,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import {
  SignClientTypes,
  ProposalTypes,
  SessionTypes,
} from "@walletconnect/types";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { useSnapshot } from "valtio";
import ModalStore from "@/src/store/ModalStore";
import { EIP155_CHAINS, EIP155_SIGNING_METHODS } from "@/src/data/EIP155Data";
import { getChainData } from "@/src/data/chainsUtil";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import SettingsStore from "@/src/store/SettingsStore";

export default function SessionProposalModal() {
  const { eip155Address } = useSnapshot(SettingsStore.state);
  const data = useSnapshot(ModalStore.state);
  const proposal = data?.data
    ?.proposal as SignClientTypes.EventArguments["session_proposal"];
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  const supportedNamespaces = useMemo(() => {
    // eip155
    const eip155Chains = Object.keys(EIP155_CHAINS);
    const eip155Methods = Object.values(EIP155_SIGNING_METHODS);

    return {
      eip155: {
        chains: eip155Chains,
        methods: eip155Methods,
        events: ["accountsChanged", "chainChanged"],
        accounts: eip155Chains
          .map((chain) => `${chain}:${eip155Address}`)
          .flat(),
      },
    };
  }, []);
  console.log("supportedNamespaces", supportedNamespaces, eip155Address);

  const requestedChains = useMemo(() => {
    if (!proposal) return [];
    const required = [];
    for (const [key, values] of Object.entries(
      proposal.params.requiredNamespaces
    )) {
      const chains = key.includes(":") ? key : values.chains;
      required.push(chains);
    }

    const optional = [];
    for (const [key, values] of Object.entries(
      proposal.params.optionalNamespaces
    )) {
      const chains = key.includes(":") ? key : values.chains;
      optional.push(chains);
    }
    console.log("requestedChains", [
      ...new Set([...required.flat(), ...optional.flat()]),
    ]);

    return [...new Set([...required.flat(), ...optional.flat()])];
  }, [proposal]);

  // the chains that are supported by the wallet from the proposal
  const supportedChains = useMemo(
    () =>
      requestedChains.map((chain) => {
        const chainData = getChainData(chain!);

        if (!chainData) return null;

        return chainData;
      }),
    [requestedChains]
  );

  // get required chains that are not supported by the wallet
  const notSupportedChains = useMemo(() => {
    if (!proposal) return [];
    const required = [];
    for (const [key, values] of Object.entries(
      proposal.params.requiredNamespaces
    )) {
      const chains = key.includes(":") ? key : values.chains;
      required.push(chains);
    }
    return required
      .flat()
      .filter(
        (chain) =>
          !supportedChains
            .map(
              (supportedChain) =>
                `${supportedChain?.namespace}:${supportedChain?.chainId}`
            )
            .includes(chain!)
      );
  }, [proposal, supportedChains]);
  console.log("notSupportedChains", notSupportedChains);

  // const namespaces = useMemo(() => {
  //   try {
  //     // the builder throws an exception if required namespaces are not supported
  //     return buildApprovedNamespaces({
  //       proposal: proposal.params,
  //       supportedNamespaces,
  //     });
  //   } catch (e) {}
  // }, [proposal.params, supportedNamespaces, address]);

  const namespaces = useMemo(() => {
    const { requiredNamespaces, optionalNamespaces } = proposal.params;
    const namespaceKey = "eip155";
    const requiredNamespace = requiredNamespaces[namespaceKey] as
      | ProposalTypes.BaseRequiredNamespace
      | undefined;
    const optionalNamespace = optionalNamespaces
      ? optionalNamespaces[namespaceKey]
      : undefined;

    let chains: string[] | undefined =
      requiredNamespace === undefined ? undefined : requiredNamespace.chains;
    if (optionalNamespace && optionalNamespace.chains) {
      if (chains) {
        // merge chains from requiredNamespace & optionalNamespace, while avoiding duplicates
        chains = Array.from(new Set(chains.concat(optionalNamespace.chains)));
      } else {
        chains = optionalNamespace.chains;
      }
    }

    const accounts: string[] = [];
    chains?.map((chain) => {
      accounts.push(`${chain}:${eip155Address}`);
      return null;
    });
    const namespace: SessionTypes.Namespace = {
      accounts,
      chains: chains,
      methods: requiredNamespace === undefined ? [] : requiredNamespace.methods,
      events: requiredNamespace === undefined ? [] : requiredNamespace.events,
    };
    namespace.methods = namespace.methods.includes("personal_sign")
      ? namespace.methods
      : [...namespace.methods, "personal_sign"];

    console.log({ namespace });

    return {
      [namespaceKey]: namespace,
    };
  }, [proposal, eip155Address]);

  // Handle approve action, construct session namespace
  const onApprove = useCallback(async () => {
    if (proposal && namespaces) {
      setIsLoadingApprove(true);

      try {
        await web3wallet.approveSession({
          id: proposal.id,
          namespaces,
        });
        SettingsStore.setSessions(
          Object.values(web3wallet.getActiveSessions())
        );
      } catch (e) {
        setIsLoadingApprove(false);
        console.log((e as Error).message, "error");
        return;
      }
    }
    setIsLoadingApprove(false);
    ModalStore.close();
  }, [namespaces, proposal]);

  // Handle reject action
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onReject = useCallback(async () => {
    if (proposal) {
      try {
        setIsLoadingReject(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await web3wallet.rejectSession({
          id: proposal.id,
          reason: getSdkError("USER_REJECTED_METHODS"),
        });
      } catch (e) {
        setIsLoadingReject(false);
        console.log((e as Error).message, "error");
        return;
      }
    }
    setIsLoadingReject(false);
    ModalStore.close();
  }, [proposal]);

  const { icons, name, url } = proposal.params.proposer.metadata;

  // connect on load
  useEffect(() => {
    onApprove();
  }, []);

  return (
    <ModalContent bg={"gray.900"}>
      <ModalHeader>Session Proposal</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Center>
          <Avatar src={icons[0]} mr="2rem" />
          <Box>
            <Text>{name}</Text>
            <Text color={"whiteAlpha.600"}>{url}</Text>
          </Box>
        </Center>
      </ModalBody>
      <ModalFooter>
        {notSupportedChains.length > 0 ? (
          <Alert status="info">
            The following required chains are not supported by your wallet - $
            {notSupportedChains.toString()}
          </Alert>
        ) : null}
        <HStack>
          {/* <Button
            onClick={() => onReject()}
            isLoading={isLoadingReject}
            colorScheme={"red"}
          >
            Reject
          </Button> */}
          <Button
            onClick={() => onApprove()}
            isLoading={isLoadingApprove}
            loadingText={"Connecting..."}
            colorScheme={"green"}
          >
            Approve
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
}
