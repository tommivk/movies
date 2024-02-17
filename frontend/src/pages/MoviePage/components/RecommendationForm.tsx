import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { fetchData } from "../../../../utils";
import Button from "../../../components/Button/Button";
import FormFieldError from "../../../components/FormFieldError/FormFieldError";
import FormLabel from "../../../components/FormLabel/FormLabel";
import FormSelect from "../../../components/FormSelect/FormSelect";
import useAppStore from "../../../store";

const RecommmendationForm = ({
  movieId,
  closeModal,
}: {
  movieId: number;
  closeModal: () => void;
}) => {
  const { token } = useAppStore().loggedUser ?? {};
  const groups = useAppStore().groups;

  const { mutate } = useMutation({
    mutationKey: ["addRecommendation"],
    mutationFn: (body: {
      groupId: number;
      movieId: number;
      description: string;
    }) =>
      fetchData({
        path: "/groups/recommendations",
        method: "POST",
        body,
        token,
      }),
    onSuccess: () => toast.success("Recommendation submitted!"),
    onError: (error: Error) => toast.error(error.message),
  });

  const schema = z.object({
    groupId: z.number({ required_error: "Group is required" }),
    description: z.string().min(1, "Description is required"),
  });
  type FormSchema = z.infer<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const selectOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <form
      className="recommendationForm"
      onSubmit={handleSubmit((data) =>
        mutate(
          { ...data, movieId },
          {
            onSuccess: () => {
              reset();
              closeModal();
            },
          }
        )
      )}
    >
      <FormLabel>Group</FormLabel>
      <Controller
        control={control}
        name="groupId"
        render={({ field: { onChange } }) => (
          <FormSelect options={selectOptions} onChange={onChange} />
        )}
      />
      <FormFieldError message={errors.groupId?.message} />

      <FormLabel>Description</FormLabel>
      <textarea
        className="recommendationForm__textArea"
        rows={5}
        spellCheck="false"
        {...register("description")}
      />
      <FormFieldError message={errors.description?.message} />

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default RecommmendationForm;
