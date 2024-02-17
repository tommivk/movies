import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchResult } from "../../../../types";
import { fetchData } from "../../../../utils";

const useInfiniteFavouritedMovies = ({
  userId,
  token,
  movieIds,
  show,
}: {
  userId?: number;
  token?: string;
  movieIds?: number[];
  show?: "all" | "rated" | "unrated";
}) => {
  return useInfiniteQuery<SearchResult>({
    queryKey: ["favouritedMovies", movieIds, show],
    queryFn: ({ pageParam = 1 }) => {
      return fetchData({
        path: `/users/me/favourited-movies?page=${pageParam}&show=${show}`,
        token,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!userId && !!token,
  });
};

export default useInfiniteFavouritedMovies;
