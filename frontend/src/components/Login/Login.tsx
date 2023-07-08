import { Dialog } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAppStore from "../../store";
import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput";
import { fetchData } from "../../../utils";

import "./login.scss";

type Credentials = {
  username: string;
  password: string;
};

const Login = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const store = useAppStore();

  const { mutateAsync } = useMutation({
    mutationFn: (credentials: Credentials) =>
      fetchData({ path: "/login", method: "POST", body: credentials }),
    onSuccess: async (userData) => {
      store.setLoggedUser(userData);
      localStorage.setItem("loggedUser", JSON.stringify(userData));
      toast.success(`Hello ${userData.username}`);
      setModalOpen(false);
      reset();
    },
    onError: ({ message }) => toast.error(message),
  });

  const { register, handleSubmit, reset } = useForm<Credentials>();

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Dialog open={modalOpen} onClose={() => {}} className="modal">
      <div className="modal__content">
        <Dialog.Panel className="modal__panel">
          <button
            className="modal__closeButton"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            ✕
          </button>
          <Dialog.Title>Login</Dialog.Title>
          <Dialog.Description>Login to Mövies</Dialog.Description>

          <form
            className="loginForm"
            onSubmit={handleSubmit((credentials) => mutateAsync(credentials))}
          >
            <FormInput
              register={register("username")}
              required={true}
              type="text"
              placeholder="Username"
            ></FormInput>
            <FormInput
              register={register("password")}
              required={true}
              type="password"
              placeholder="Password"
            ></FormInput>
            <button type="submit">Login</button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Login;
