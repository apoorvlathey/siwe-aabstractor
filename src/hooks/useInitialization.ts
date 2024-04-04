import { useCallback, useEffect, useState } from "react";
import { createWeb3Wallet } from "@/src/utils/WalletConnectUtil";
import { useAccount } from "wagmi";

export default function useInitialization() {
  const { isConnected } = useAccount();

  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    if (!isConnected) return;

    try {
      await createWeb3Wallet();
      setInitialized(true);
    } catch (err: unknown) {
      console.error("Initialization failed", err);
      alert(err);
    }
  }, [isConnected]);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize, isConnected]);

  return initialized;
}
