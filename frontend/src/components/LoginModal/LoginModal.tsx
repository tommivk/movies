import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAppStore from "../../store";
import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput";
import { fetchData } from "../../../utils";
import { SetStateAction, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Credentials } from "../../../types";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import * as z from "zod";

import "./loginModal.scss";

const Login = ({
  modalOpen,
  setModalOpen,
  login,
}: {
  login: boolean;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLogin, setIsLogin] = useState(login);

  useEffect(() => {
    setIsLogin(login);
  }, [login]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      title={isLogin ? "Login" : "Sign Up"}
    >
      <div className="form">
        {isLogin ? (
          <LoginForm setModalOpen={setModalOpen} />
        ) : (
          <SignupForm setModalOpen={setModalOpen} />
        )}

        {isLogin ? (
          <button
            className="form__changeFormBtn"
            onClick={() => setIsLogin(false)}
          >
            Not a user? Sign up Here
          </button>
        ) : (
          <button
            className="form__changeFormBtn"
            onClick={() => setIsLogin(true)}
          >
            Already a user? Login
          </button>
        )}
      </div>
    </Modal>
  );
};

const FormFieldError = ({ message }: { message?: string }) => {
  return <p className="form__error">{message}</p>;
};

const SignupForm = ({
  setModalOpen,
}: {
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const store = useAppStore();

  const signupSchema = z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(19, "Username must be less than 20 characters long"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      passwordConfirm: z.string(),
    })
    .refine((values) => values.password === values.passwordConfirm, {
      message: "Password does not match the password confirmation",
      path: ["passwordConfirm"],
    });

  type SignUpValues = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
  });

  const { mutateAsync: login } = useMutation({
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

  const { mutateAsync } = useMutation({
    mutationFn: ({ username, password }: SignUpValues) =>
      fetchData({
        path: "/signup",
        method: "POST",
        body: { username, password },
      }),
    onSuccess: async () => {
      const { username, password } = getValues();
      login({ username, password });
      reset();
    },
    onError: ({ message }) => toast.error(message),
  });

  return (
    <form onSubmit={handleSubmit((credentials) => mutateAsync(credentials))}>
      <FormInput
        register={register("username")}
        autoComplete="nope"
        required={true}
        type="text"
        placeholder="Username"
        error={!!errors.username}
        data-cy="username"
      ></FormInput>
      <FormFieldError message={errors.username?.message} />
      <FormInput
        register={register("password")}
        required={true}
        type="password"
        placeholder="Password"
        error={!!errors.password}
        data-cy="password"
      ></FormInput>
      <FormFieldError message={errors.password?.message} />
      <FormInput
        register={register("passwordConfirm")}
        required={true}
        type="password"
        placeholder="Confirm password"
        error={!!errors.passwordConfirm}
        data-cy="passwordConfirm"
      ></FormInput>
      <FormFieldError message={errors.passwordConfirm?.message} />
      <Button
        className="form__submitBtn"
        type="submit"
        size="md"
        data-cy="submit"
      >
        Sign Up
      </Button>
    </form>
  );
};

const LoginForm = ({
  setModalOpen,
}: {
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const store = useAppStore();

  const { register, handleSubmit, reset } = useForm<Credentials>();

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
      <Button className="form__submitBtn" type="submit" data-cy="submit">
        Login
      </Button>
    </form>
  );
};

export default Login;
