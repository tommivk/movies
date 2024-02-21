import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../../../utils";
import { toast } from "react-toastify";
import useAppStore from "../../../store";

const useDeleteRecommendation = () => {
  const queryClient = useQueryClient();
  const { token } = useAppStore().loggedUser ?? {};

  return useMutation({
    mutationKey: ["deleteRecommendation"],
    mutationFn: (id: string) =>
      fetchData({
        path: `/recommendations/${id}`,
        method: "DELETE",
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["getRecommendations"]);
      toast.success("Recommendation deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export default useDeleteRecommendation;
