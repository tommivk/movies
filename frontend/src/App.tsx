import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { createContext, useState } from "react";
import { router } from "./router";
import useFetchUserData from "./hooks/useFetchUserData";
import useLoggedUser from "./hooks/useLoggedUser";
import LoginSignUpModal from "./components/LoginSignUpModal.tsx/LoginSignUpModal";

import "react-toastify/dist/ReactToastify.css";

type LoginModalContext = {
  setModalState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      isLogin: boolean;
    }>
  >;
};

export const ModalContext = createContext<LoginModalContext>({
  setModalState: () => undefined,
});

function App() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    isLogin: false,
  });

  useLoggedUser();
  useFetchUserData();

  return (
    <>
      <LoginSignUpModal modalState={modalState} setModalState={setModalState} />
      <ModalContext.Provider value={{ setModalState }}>
        <RouterProvider router={router} />
      </ModalContext.Provider>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        hideProgressBar={true}
      />
    </>
  );
}

export default App;
