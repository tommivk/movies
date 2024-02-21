import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../../../utils";
import { toast } from "react-toastify";
import useAppStore from "../../../store";

const useDeleteRecommendationComment = () => {
  const queryClient = useQueryClient();
  const { token } = useAppStore().loggedUser ?? {};

  return useMutation({
    mutationKey: ["deleteRecommendationComment"],
    mutationFn: ({
      recommendationId,
      commentId,
    }: {
      recommendationId: string;
      commentId: string;
    }) =>
      fetchData({
        path: `/recommendations/${recommendationId}/comments/${commentId}`,
        method: "DELETE",
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["getRecommendationComments"]);
      toast.success("Comment deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export default useDeleteRecommendationComment;
