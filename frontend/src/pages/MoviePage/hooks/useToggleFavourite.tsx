import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../../../utils";
import { toast } from "react-toastify";
import { Movie } from "../../../../types";

type Props = {
  isFavourited: boolean;
  token?: string;
  movie: Movie;
};

const useToggleFavourite = ({ isFavourited, movie, token }: Props) => {
  const queryClient = useQueryClient();

  const removeFavourite = async () => {
    return await fetchData({
      path: `/movies/${movie.id}/favourite`,
      token,
      method: "DELETE",
    });
  };

  const addFavourite = async () => {
    if (!token) {
      throw new Error("You must be logged in to favourite movies");
    }
    return await fetchData({
      path: `/movies/${movie.id}/favourite`,
      token,
      method: "POST",
    });
  };

  return useMutation({
    mutationKey: ["toggleFav", isFavourited],
    mutationFn: isFavourited ? removeFavourite : addFavourite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUserData"] });
      toast.success(
        isFavourited
          ? `"${movie.title}" has been removed from your favourites`
          : `"${movie.title}" has been added to your favourites`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export default useToggleFavourite;
