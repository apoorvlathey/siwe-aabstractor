import { useCallback, useState } from "react";
import { Web3WalletTypes } from "@walletconnect/web3wallet";
import { SignClientTypes } from "@walletconnect/types";

import { EIP155_SIGNING_METHODS } from "@/src/data/EIP155Data";
import { web3wallet } from "@/src/utils/WalletConnectUtil";
import ModalStore from "@/src//store/ModalStore";
import SettingsStore from "@/src/store/SettingsStore";

export default function useWalletConnectEventsManager(initialized: boolean) {
  const [eventsInitialized, setEventsInitialized] = useState(false);

  /******************************************************************************
   * 1. Open session proposal modal for confirmation / rejection
   *****************************************************************************/
  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
      console.log("session_proposal", proposal);
      // set the verify context so it can be displayed in the projectInfoCard
      SettingsStore.setCurrentRequestVerifyContext(proposal.verifyContext);
      ModalStore.open("SessionProposalModal", { proposal });
    },
    []
  );
  /******************************************************************************
   * 2. Open Auth modal for confirmation / rejection
   *****************************************************************************/
  const onAuthRequest = useCallback((request: Web3WalletTypes.AuthRequest) => {
    ModalStore.open("AuthRequestModal", { request });
  }, []);

  /******************************************************************************
   * 3. Open request handling modal based on method that was used
   *****************************************************************************/
  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
      console.log("session_request", requestEvent);
      const { topic, params, verifyContext } = requestEvent;
      const { request } = params;
      const requestSession = web3wallet.engine.signClient.session.get(topic);
      // set the verify context so it can be displayed in the projectInfoCard
      SettingsStore.setCurrentRequestVerifyContext(verifyContext);

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          return ModalStore.open("SessionSignModal", {
            requestEvent,
            requestSession,
          });

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          return ModalStore.open("SessionSignTypedDataModal", {
            requestEvent,
            requestSession,
          });

        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
          return ModalStore.open("SessionSendTransactionModal", {
            requestEvent,
            requestSession,
          });

        default:
          return ModalStore.open("SessionUnsuportedMethodModal", {
            requestEvent,
            requestSession,
          });
      }
    },
    []
  );

  /******************************************************************************
   * Set up WalletConnect event listeners
   *****************************************************************************/
  console.log({ initialized, web3wallet, eventsInitialized });
  if (initialized && web3wallet && !eventsInitialized) {
    console.log("Setting up WalletConnect event listeners...");
    setEventsInitialized(true);
    // sign
    web3wallet.on("session_proposal", onSessionProposal);
    web3wallet.on("session_request", onSessionRequest);
    // auth
    web3wallet.on("auth_request", onAuthRequest);
    // TODOs
    web3wallet.engine.signClient.events.on("session_ping", (data) =>
      console.log("ping", data)
    );
    web3wallet.on("session_delete", (data) => {
      console.log("session_delete event received", data);
      SettingsStore.setSessions(Object.values(web3wallet.getActiveSessions()));
    });
    // load sessions on init
    SettingsStore.setSessions(Object.values(web3wallet.getActiveSessions()));
  }
}
