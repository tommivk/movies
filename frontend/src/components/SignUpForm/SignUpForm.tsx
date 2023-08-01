import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Credentials } from "../../../types";
import { fetchData } from "../../../utils";
import useAppStore from "../../store";
import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import FormFieldError from "../FormFieldError/FormFieldError";

type Props = {
  closeModal: () => void;
};

const SignupForm = ({ closeModal }: Props) => {
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
      closeModal();
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
      <Button className="submitButton" type="submit" size="md" data-cy="submit">
        Sign Up
      </Button>
    </form>
  );
};

export default SignupForm;
