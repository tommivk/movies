import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useModalContext from "../../context/useModalContext";
import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import FormFieldError from "../FormFieldError/FormFieldError";
import useSignUp from "../../hooks/useSignUp";
import useLogin from "../../hooks/useLogin";

const SignupForm = () => {
  const { closeModal } = useModalContext();
  const { mutate: signUp } = useSignUp();
  const { mutate: login } = useLogin();

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

  const closeModalAndResetForm = () => {
    closeModal();
    reset();
  };

  const handleLogin = () => {
    const credentials = getValues();
    login(credentials, {
      onSuccess: closeModalAndResetForm,
    });
  };

  return (
    <form
      onSubmit={handleSubmit((credentials) =>
        signUp(credentials, { onSuccess: handleLogin })
      )}
    >
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
