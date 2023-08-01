import LoginForm from "../LoginForm/LoginForm";
import Modal from "../Modal/Modal";
import SignupForm from "../SignUpForm/SignUpForm";

import "./loginSignUpModal.scss";

type Props = {
  modalState: { isOpen: boolean; isLogin: boolean };
  setModalState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      isLogin: boolean;
    }>
  >;
};

const LoginSignUpModal = ({ modalState, setModalState }: Props) => {
  const handleModalClose = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <Modal
      open={modalState.isOpen}
      onClose={handleModalClose}
      title={modalState.isLogin ? "Login" : "Sign Up"}
    >
      <div className="loginSignUpModal">
        {modalState.isLogin ? (
          <LoginForm closeModal={handleModalClose} />
        ) : (
          <SignupForm closeModal={handleModalClose} />
        )}

        {modalState.isLogin ? (
          <button
            className="loginSignUpModal__changeFormBtn"
            onClick={() => setModalState({ ...modalState, isLogin: false })}
          >
            Not a user? Sign up Here
          </button>
        ) : (
          <button
            className="loginSignUpModal__changeFormBtn"
            onClick={() => setModalState({ ...modalState, isLogin: true })}
          >
            Already a user? Login
          </button>
        )}
      </div>
    </Modal>
  );
};

export default LoginSignUpModal;
