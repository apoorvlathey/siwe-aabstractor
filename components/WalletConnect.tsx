import { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Center,
} from "@chakra-ui/react";
import { parseUri } from "@walletconnect/utils";
import ModalStore from "@/src/store/ModalStore";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import SettingsStore from "@/src/store/SettingsStore";

interface WalletConnectParams {
  initialized: boolean;
}

export default function WalletConnect({ initialized }: WalletConnectParams) {
  const [address, setAddress] = useState("");
  const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(false);

  async function onConnect() {
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
      setLoading(true);
      web3wallet.core.pairing.events.on(
        "pairing_expire",
        pairingExpiredListener
      );
      await web3wallet.pair({ uri });
    } catch (error) {
      console.log((error as Error).message, "error");
      ModalStore.close();
    } finally {
      setLoading(false);
      // setUri("");
    }
  }

  return (
    <Box w="30rem">
      <FormControl mb="1rem">
        <FormLabel>Address to Impersonate</FormLabel>
        <Input
          placeholder="address"
          value={address}
          onChange={(e) => {
            const value = e.target.value;
            setAddress(value);
            SettingsStore.setEIP155Address(value);
          }}
        />
      </FormControl>
      <FormControl mb="1rem">
        <FormLabel>WalletConnect URI (from dapp)</FormLabel>
        <Input
          placeholder="uri"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
      </FormControl>
      <Center>
        <Button
          onClick={() => onConnect()}
          isLoading={loading}
          isDisabled={!initialized}
        >
          {!initialized ? "Initializing..." : "Connect"}
        </Button>
      </Center>
    </Box>
  );
}
