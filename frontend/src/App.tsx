import Login from "./components/LoginModal/LoginModal";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import useFetchUserData from "./hooks/useFetchUserData";
import useLoggedUser from "./hooks/useLoggedUser";
import { createContext, useState } from "react";
import { router } from "./router";

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

  console.log("yo yo");

  return (
    <>
      <Login
        modalOpen={modalState.isOpen}
        login={modalState.isLogin}
        setModalOpen={(value) =>
          setModalState({ ...modalState, isOpen: Boolean(value) })
        }
      />
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
