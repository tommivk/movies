import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchResult } from "../../types";
import { fetchData } from "../../utils";

const useInfiniteFavouritedMovies = (
  userId?: number,
  token?: string,
  movieIds?: number[]
) => {
  return useInfiniteQuery<SearchResult>({
    queryKey: ["favouritedMovies", movieIds],
    queryFn: ({ pageParam = 1 }) =>
      fetchData({
        path: `/users/${userId}/favourited-movies?page=${pageParam}`,
        token,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!userId && !!token,
  });
};

export default useInfiniteFavouritedMovies;
