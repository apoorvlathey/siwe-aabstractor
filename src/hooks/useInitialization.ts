import { useCallback, useEffect, useRef, useState } from "react";
import { createWeb3Wallet, web3wallet } from "@/src/utils/WalletConnectUtil";
import SettingsStore from "@/src/store/SettingsStore";
import { useAccount } from "wagmi";

export default function useInitialization() {
  const { address } = useAccount();

  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    if (!address) return;

    try {
      SettingsStore.setEIP155Address(address);
      await createWeb3Wallet();
      setInitialized(true);
    } catch (err: unknown) {
      console.error("Initialization failed", err);
      alert(err);
    }
  }, [address]);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize, address]);

  return initialized;
}
