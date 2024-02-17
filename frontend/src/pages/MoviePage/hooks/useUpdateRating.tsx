import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../../../utils";
import { toast } from "react-toastify";

const useUpdateRating = () => {
  const queryClient = useQueryClient();

  const updateRating = async ({
    movieId,
    token,
    rating,
  }: {
    movieId?: string;
    token?: string;
    rating?: number;
  }) => {
    if (!rating) throw new Error("Missing rating");
    if (!movieId) throw new Error("Missing movieId");
    if (!token) throw new Error("You must be logged in to rate movies");

    return await fetchData({
      method: "PATCH",
      path: `/movies/${movieId}/ratings`,
      body: { rating },
      token,
    });
  };

  return useMutation({
    mutationKey: ["updateRating"],
    mutationFn: updateRating,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchUserData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetchMovie"],
      });
      toast.success("Rating updated!");
    },
    onError: (error: Error) => toast.error(error.message),
  });
};
export default useUpdateRating;
