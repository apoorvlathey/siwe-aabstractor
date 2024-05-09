import { Verify, SessionTypes } from "@walletconnect/types";
import { proxy } from "valtio";
import { sepolia } from "wagmi/chains";

/**
 * Types
 */
interface State {
  initialized: boolean;
  eip155Address: string;
  activeChainId: string;
  currentRequestVerifyContext?: Verify.Context;
  sessions: SessionTypes.Struct[];
  isConnectLoading: boolean;
}

/**
 * State
 */
const state = proxy<State>({
  initialized: false,
  activeChainId: sepolia.id.toString(),
  eip155Address: "",
  sessions: [],
  isConnectLoading: false,
});

/**
 * Store / Actions
 */
const SettingsStore = {
  state,

  setInitialized(value: boolean) {
    state.initialized = value;
  },

  setEIP155Address(eip155Address: string) {
    state.eip155Address = eip155Address;
  },

  setActiveChainId(value: string) {
    state.activeChainId = value;
  },

  setCurrentRequestVerifyContext(context: Verify.Context) {
    state.currentRequestVerifyContext = context;
  },
  setSessions(sessions: SessionTypes.Struct[]) {
    state.sessions = sessions;
  },

  setIsConnectLoading(isConnectLoading: boolean) {
    state.isConnectLoading = isConnectLoading;
  },
};

export default SettingsStore;
