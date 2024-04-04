import { Verify, SessionTypes } from "@walletconnect/types";
import { proxy } from "valtio";
import { sepolia } from "wagmi/chains";

/**
 * Types
 */
interface State {
  eip155Address: string;
  activeChainId: string;
  currentRequestVerifyContext?: Verify.Context;
  sessions: SessionTypes.Struct[];
}

/**
 * State
 */
const state = proxy<State>({
  activeChainId: sepolia.id.toString(),
  eip155Address: "",
  sessions: [],
});

/**
 * Store / Actions
 */
const SettingsStore = {
  state,

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
};

export default SettingsStore;
