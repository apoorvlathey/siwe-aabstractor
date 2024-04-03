import { useCallback, useMemo } from "react";
import { Modal as CModal, ModalOverlay } from "@chakra-ui/react";
import ModalStore from "@/src/store/ModalStore";
import { useSnapshot } from "valtio";
import SessionProposalModal from "@/src/views/SessionProposalModal";

export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state);

  console.log({ open, view });

  const onClose = useCallback(() => {
    if (open) {
      ModalStore.close();
    }
  }, [open]);

  const componentView = useMemo(() => {
    switch (view) {
      case "SessionProposalModal":
        return <SessionProposalModal />;
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
