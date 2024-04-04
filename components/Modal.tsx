import { useCallback, useMemo } from "react";
import { Modal as CModal, ModalOverlay } from "@chakra-ui/react";
import ModalStore from "@/src/store/ModalStore";
import { useSnapshot } from "valtio";
import SessionProposalModal from "@/src/views/SessionProposalModal";
import SessionSignModal from "@/src/views/SessionSignModal";
import SessionSendTransactionModal from "@/src/views/SessionSendTransactionModal";

export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state);

  const onClose = useCallback(() => {
    if (open) {
      ModalStore.close();
    }
  }, [open]);

  const componentView = useMemo(() => {
    switch (view) {
      case "SessionProposalModal":
        return <SessionProposalModal />;
      case "SessionSignModal":
        return <SessionSignModal />;
      case "SessionSendTransactionModal":
        return <SessionSendTransactionModal />;
      default:
        return null;
    }
  }, [view]);

  return (
    <CModal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="3px" />
      {componentView}
    </CModal>
  );
}
