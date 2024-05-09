import { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Center,
  useToast,
} from "@chakra-ui/react";
import { parseUri } from "@walletconnect/utils";
import ModalStore from "@/src/store/ModalStore";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import SettingsStore from "@/src/store/SettingsStore";
import { useSnapshot } from "valtio";
import { getEnsAddress } from "@/helpers/utils";
import { isAddress } from "viem";

interface WalletConnectParams {
  setIsEIP155AddressValid: (isValid: boolean) => void;
}

export default function WalletConnect({
  setIsEIP155AddressValid,
}: WalletConnectParams) {
  const toast = useToast();

  const { eip155Address, isConnectLoading, initialized } = useSnapshot(
    SettingsStore.state
  );

  const [uri, setUri] = useState("");

  const resolveAndValidateAddress = async () => {
    let isValid;
    let _eip155address = eip155Address;
    if (!eip155Address) {
      isValid = false;
    } else {
      // Resolve ENS
      const resolvedAddress = await getEnsAddress(eip155Address);
      if (resolvedAddress) {
        _eip155address = resolvedAddress;
        isValid = true;
      } else if (isAddress(eip155Address)) {
        isValid = true;
      } else {
        isValid = false;
      }
    }

    if (!isValid) {
      toast({
        title: "Invalid Address",
        description: "Address is not an ENS or Ethereum address",
        status: "error",
        isClosable: true,
        duration: 4000,
      });
    }

    return { isValid, _address: _eip155address };
  };

  async function onConnect() {
    SettingsStore.setIsConnectLoading(true);
    const { isValid, _address } = await resolveAndValidateAddress();
    setIsEIP155AddressValid(isValid);
    SettingsStore.setEIP155Address(_address);
    if (!isValid) {
      SettingsStore.setIsConnectLoading(false);
      return;
    }

    const { topic: pairingTopic } = parseUri(uri);
    // if for some reason, the proposal is not received, we need to close the modal when the pairing expires (5mins)
    const pairingExpiredListener = ({ topic }: { topic: string }) => {
      if (pairingTopic === topic) {
        console.log(
          "Pairing expired. Please try again with new Connection URI",
          "error"
        );
        ModalStore.close();
        web3wallet.core.pairing.events.removeListener(
          "pairing_expire",
          pairingExpiredListener
        );
      }
    };

    web3wallet.once("session_proposal", () => {
      web3wallet.core.pairing.events.removeListener(
        "pairing_expire",
        pairingExpiredListener
      );
    });

    try {
      web3wallet.core.pairing.events.on(
        "pairing_expire",
        pairingExpiredListener
      );
      await web3wallet.pair({ uri });
    } catch (error) {
      console.log((error as Error).message, "error");
      ModalStore.close();
    }
  }

  return (
    <>
      <FormControl mt="1rem" mb="1rem">
        <FormLabel fontWeight={"bold"}>WalletConnect URI (from dapp)</FormLabel>
        <Input
          placeholder="wc:xyz123..."
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          bg={"brand.lightBlack"}
        />
      </FormControl>
      <Center>
        <Button
          onClick={() => onConnect()}
          isLoading={isConnectLoading}
          isDisabled={!initialized}
        >
          {!initialized ? "Initializing..." : "Connect"}
        </Button>
      </Center>
    </>
  );
}
