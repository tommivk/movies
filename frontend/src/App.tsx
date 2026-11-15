import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ModalProvider } from "./context/ModalContext";
import useFetchUserData from "./hooks/useFetchUserData";
import useLoggedUser from "./hooks/useLoggedUser";
import LoginSignUpModal from "./components/LoginSignUpModal/LoginSignUpModal";

import "react-toastify/dist/ReactToastify.css";

function App() {
  useLoggedUser();
  useFetchUserData();

  return (
    <>
      <ModalProvider>
        <LoginSignUpModal />
        <RouterProvider router={router} />
      </ModalProvider>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        hideProgressBar={true}
      />
    </>
  );
}

export default App;
