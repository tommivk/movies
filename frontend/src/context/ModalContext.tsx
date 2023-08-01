import { useState, createContext, PropsWithChildren } from "react";

type ModalState = { isOpen: boolean; isLogin: boolean };

type LoginModalContext = {
  modalState: ModalState;
  openLoginModal: () => void;
  openSignUpModal: () => void;
  closeModal: () => void;
};

const ModalContext = createContext<LoginModalContext | undefined>(undefined);

const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    isLogin: false,
  });

  return (
    <ModalContext.Provider
      value={{
        modalState,
        openLoginModal: () => setModalState({ isOpen: true, isLogin: true }),
        openSignUpModal: () => setModalState({ isOpen: true, isLogin: false }),
        closeModal: () => setModalState({ ...modalState, isOpen: false }),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
