import { zodResolver } from "@hookform/resolvers/zod";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import useCreateGroup from "../../hooks/useCreateGroup";
import useAppStore from "../../store";
import Button from "../Button/Button";
import FormFieldError from "../FormFieldError/FormFieldError";
import FormInput from "../FormInput/FormInput";
import FormLabel from "../FormLabel/FormLabel";

import "./newGroupForm.scss";

const CustomToggle = ({
  label,
  onChange,
  variant,
  active,
}: {
  label: string;
  onChange: () => void;
  variant: "left" | "right";
  active: boolean;
}) => {
  return (
    <div
      className={classnames("customToggle", {
        left: variant === "left",
        right: variant === "right",
        active: active,
      })}
      onClick={onChange}
    >
      {label}
    </div>
  );
};

const NewGroupForm = ({ onClose }: { onClose: () => void }) => {
  const { mutate: createGroup } = useCreateGroup();
  const token = useAppStore().loggedUser?.token;

  const formSchema = z
    .object({
      name: z.string().min(1, "Group name cannot be empty"),
      private: z.boolean(),
      password: z.string().optional(),
      passwordConfirm: z.string().optional(),
    })
    .superRefine((input, ctx) => {
      if (input.private && (!input.password || input.password.length < 5)) {
        ctx.addIssue({
          message: "Password must be at least 5 characters long",
          code: z.ZodIssueCode.custom,
          path: ["password"],
        });
      }
      if (input.private && input.password !== input.passwordConfirm) {
        ctx.addIssue({
          message: "Password does not match password confirmation",
          code: z.ZodIssueCode.custom,
          path: ["passwordConfirm"],
        });
      }
    });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { private: false },
  });

  const isPrivate = watch("private");

  return (
    <form
      className="newGroupForm"
      onSubmit={handleSubmit((data) =>
        createGroup(
          { body: data, token },
          {
            onSuccess: () => {
              toast.success("Group successfully created");
              reset();
              onClose();
            },
          }
        )
      )}
    >
      <FormInput
        placeholder="Group name"
        register={register("name")}
        autoComplete="off"
        error={!!errors.name}
      />
      <FormFieldError message={errors.name?.message} />

      <FormLabel>Group publicity</FormLabel>
      <Controller
        control={control}
        name="private"
        render={({ field: { value, onChange } }) => (
          <CustomToggle
            variant="left"
            label="public"
            onChange={() => onChange(false)}
            active={!value}
          />
        )}
      />
      <Controller
        control={control}
        name="private"
        render={({ field: { value, onChange } }) => (
          <CustomToggle
            variant="right"
            label="private"
            onChange={() => onChange(true)}
            active={value}
          />
        )}
      />
      <p className="newGroupForm__privateLabel">
        {isPrivate
          ? "Only people with password can join"
          : "Anyone can join this group"}
      </p>

      {isPrivate && (
        <>
          <FormInput
            type="password"
            placeholder="Password"
            register={register("password")}
            autoComplete="off"
            error={!!errors.password}
          />
          <FormFieldError message={errors.password?.message} />
          <FormInput
            type="password"
            placeholder="Password confirmation"
            register={register("passwordConfirm")}
            error={!!errors.passwordConfirm}
          />
          <FormFieldError message={errors.passwordConfirm?.message} />
        </>
      )}

      <Button type="submit">Create</Button>
    </form>
  );
};

export default NewGroupForm;
