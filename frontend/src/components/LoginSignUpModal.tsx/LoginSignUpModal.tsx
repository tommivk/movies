import LoginForm from "../LoginForm/LoginForm";
import Modal from "../Modal/Modal";
import SignupForm from "../SignUpForm/SignUpForm";
import useModalContext from "../../context/useModalContext";

import "./loginSignUpModal.scss";

const LoginSignUpModal = () => {
  const { modalState, openLoginModal, openSignUpModal, closeModal } =
    useModalContext();

  return (
    <Modal
      open={modalState.isOpen}
      onClose={closeModal}
      title={modalState.isLogin ? "Login" : "Sign Up"}
    >
      <div className="loginSignUpModal">
        {modalState.isLogin ? <LoginForm /> : <SignupForm />}

        {modalState.isLogin ? (
          <button
            className="loginSignUpModal__changeFormBtn"
            onClick={openSignUpModal}
          >
            Not a user? Sign up Here
          </button>
        ) : (
          <button
            className="loginSignUpModal__changeFormBtn"
            onClick={openLoginModal}
          >
            Already a user? Login
          </button>
        )}
      </div>
    </Modal>
  );
};

export default LoginSignUpModal;
