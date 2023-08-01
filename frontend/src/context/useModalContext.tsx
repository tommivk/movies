import { useContext } from "react";
import { ModalContext } from "./ModalContext";

const useModalContext = () => {
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
    throw new Error("Modal context was undefined");
  }
  return modalContext;
};

export default useModalContext;
