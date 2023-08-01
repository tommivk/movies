import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Credentials } from "../../../types";
import { fetchData } from "../../../utils";
import useAppStore from "../../store";
import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";

type Props = {
  closeModal: () => void;
};

const LoginForm = ({ closeModal }: Props) => {
  const store = useAppStore();

  const { register, handleSubmit, reset } = useForm<Credentials>();

  const { mutateAsync } = useMutation({
    mutationFn: (credentials: Credentials) =>
      fetchData({ path: "/login", method: "POST", body: credentials }),
    onSuccess: async (userData) => {
      store.setLoggedUser(userData);
      localStorage.setItem("loggedUser", JSON.stringify(userData));
      toast.success(`Hello ${userData.username}`);
      closeModal();
      reset();
    },
    onError: ({ message }) => toast.error(message),
  });

  return (
    <form onSubmit={handleSubmit((credentials) => mutateAsync(credentials))}>
      <FormInput
        register={register("username")}
        required={true}
        type="text"
        placeholder="Username"
        data-cy="username"
      ></FormInput>
      <FormInput
        register={register("password")}
        required={true}
        type="password"
        placeholder="Password"
        data-cy="password"
      ></FormInput>
      <Button className="submitButton" type="submit" data-cy="submit">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
