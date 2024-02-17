import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchResult } from "../../../../types";
import { fetchData } from "../../../../utils";

const useInfiniteTrendingMovies = () => {
  return useInfiniteQuery<SearchResult>({
    queryKey: ["trendingMovies"],
    queryFn: ({ pageParam = 1 }) =>
      fetchData({
        path: `/movies/trending?page=${pageParam}`,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};

export default useInfiniteTrendingMovies;
