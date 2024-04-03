import { Avatar, Box, HStack, Button } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import SettingsStore from "@/src/store/SettingsStore";
import { updateSignClientChainId } from "@/src/utils/WalletConnectUtil";
import {
  EIP155_MAINNET_CHAINS,
  EIP155_TEST_CHAINS,
} from "@/src/data/EIP155Data";
import { sepolia } from "wagmi/chains";

interface IAccountCard {
  name: string;
  logo: string;
  rgb: string;
  address: string;
  chainId: string;
}

function AccountCard({ name, logo, rgb, address = "", chainId }: IAccountCard) {
  const { activeChainId } = useSnapshot(SettingsStore.state);

  async function onChainChanged(chainId: string, address: string) {
    SettingsStore.setActiveChainId(chainId);
    await updateSignClientChainId(chainId.toString(), address);
  }

  return (
    <HStack bg={rgb}>
      <Avatar src={logo} />
      <Box>
        <Box>{name}</Box>
        <Box>{address}</Box>
      </Box>
      <Button onClick={() => onChainChanged(chainId, address)}>
        {activeChainId === chainId ? `✅` : `🔄`}
      </Button>
    </HStack>
  );
}

export default function Accounts() {
  const { eip155Address } = useSnapshot(SettingsStore.state);

  const caip10 = `eip155:${sepolia.id}`;
  const { name, logo, rgb } = EIP155_TEST_CHAINS[caip10];

  return (
    <Box>
      <AccountCard
        name={name}
        logo={logo}
        rgb={rgb}
        address={eip155Address}
        chainId={caip10}
      />
    </Box>
  );
}
