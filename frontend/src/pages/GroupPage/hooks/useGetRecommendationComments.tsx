import { useQuery } from "@tanstack/react-query";
import { RecommendationComment } from "../../../../types";
import { fetchData } from "../../../../utils";
import useAppStore from "../../../store";

const useGetRecommendationComments = (recommendationId: number) => {
  const { token } = useAppStore().loggedUser ?? {};

  return useQuery<RecommendationComment[]>({
    queryKey: ["getRecommendationComments", recommendationId],
    queryFn: () =>
      fetchData({
        path: `/recommendations/${recommendationId}/comments`,
        token,
      }),
  });
};

export default useGetRecommendationComments;
