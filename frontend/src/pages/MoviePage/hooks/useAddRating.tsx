import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../../../utils";
import { toast } from "react-toastify";

const useAddRating = () => {
  const queryClient = useQueryClient();

  const addRating = async ({
    rating,
    movieId,
    token,
  }: {
    rating?: number;
    movieId?: string;
    token?: string;
  }) => {
    if (!rating) throw new Error("Missing rating");
    if (!movieId) throw new Error("Missing movieId");
    if (!token) throw new Error("You must be logged in to rate movies");

    return await fetchData({
      method: "POST",
      path: `/movies/${movieId}/ratings`,
      body: { rating },
      token,
    });
  };

  return useMutation({
    mutationKey: ["addRating"],
    mutationFn: addRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUserData"] });
      queryClient.invalidateQueries({
        queryKey: ["fetchMovie"],
      });
      toast.success("Rating added!");
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export default useAddRating;
