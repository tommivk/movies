import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchResult } from "../../../../types";
import { fetchData } from "../../../../utils";

const useInfiniteTopRatedMovies = () => {
  return useInfiniteQuery<SearchResult>({
    queryKey: ["topRatedMovies"],
    queryFn: ({ pageParam = 1 }) =>
      fetchData({
        path: `/movies/top-rated?page=${pageParam}`,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};

export default useInfiniteTopRatedMovies;
