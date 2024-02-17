import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../../../utils";
import useAppStore from "../../../store";

const useCreateRecommendationComment = (recommendationId: number) => {
  const queryClient = useQueryClient();
  const { token } = useAppStore().loggedUser ?? {};

  return useMutation({
    mutationKey: ["sendRecommendationComment"],
    mutationFn: (comment: string) =>
      fetchData({
        path: `/recommendations/${recommendationId}/comments`,
        method: "POST",
        body: { comment },
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["getRecommendationComments"]);
      queryClient.invalidateQueries(["getGroup"]);
      queryClient.invalidateQueries(["getRecommendations"]);
    },
  });
};

export default useCreateRecommendationComment;
