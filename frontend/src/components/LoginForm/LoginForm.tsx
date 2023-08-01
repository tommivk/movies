import { useForm } from "react-hook-form";
import { Credentials } from "../../../types";
import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import useLogin from "../../hooks/useLogin";
import useModalContext from "../../context/useModalContext";

const LoginForm = () => {
  const { closeModal } = useModalContext();
  const { register, handleSubmit, reset } = useForm<Credentials>();
  const { mutate: login } = useLogin();

  const onSuccess = () => {
    reset();
    closeModal();
  };

  return (
    <form
      onSubmit={handleSubmit((credentials) =>
        login(credentials, { onSuccess })
      )}
    >
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
