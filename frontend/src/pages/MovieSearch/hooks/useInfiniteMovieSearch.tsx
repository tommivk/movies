import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchResult } from "../../../../types";
import { fetchData } from "../../../../utils";

const useInfiniteMovieSearch = (query: string) => {
  return useInfiniteQuery<SearchResult>({
    queryKey: ["movieSearch", query],
    queryFn: ({ pageParam = 1 }) =>
      fetchData({
        path: `/movies/search?q=${query}&page=${pageParam}`,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!query,
  });
};

export default useInfiniteMovieSearch;
