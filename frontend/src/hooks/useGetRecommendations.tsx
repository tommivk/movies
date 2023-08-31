import { useQuery } from "@tanstack/react-query";
import { Recommendation } from "../../types";
import { fetchData } from "../../utils";
import useAppStore from "../store";

const useGetRecommendations = (groupId: number) => {
  const { token } = useAppStore().loggedUser ?? {};

  return useQuery<Recommendation[]>({
    queryKey: ["getRecommendations", groupId],
    queryFn: () =>
      fetchData({
        path: `/groups/${groupId}/recommendations`,
        method: "GET",
        token,
      }),
  });
};

export default useGetRecommendations;
