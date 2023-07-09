import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { SearchResult } from "../../../types";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";

import "./infiniteMovieContainer.scss";
import MovieList from "../MovieList/MovieList";

const InfiniteMovieContainer = ({
  queryResult,
  enabled = true,
}: {
  queryResult: UseInfiniteQueryResult<SearchResult, unknown>;
  enabled?: boolean;
}) => {
  const {
    data,
    error,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = queryResult;

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && enabled) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, enabled]);

  const movies =
    useMemo(() => data?.pages.flatMap((page) => page.results), [data]) ?? [];

  if (!enabled) return <></>;

  if (isError) {
    console.error({ error });
    if (error instanceof Error) {
      return <p>Error happened: {error.message}</p>;
    }
    return <p>Error</p>;
  }

  if (isLoading) {
    return <p className="search__info">Loading</p>;
  }

  if (movies.length === 0) {
    return <p className="search__info">No results found</p>;
  }

  return (
    <>
      <MovieList movies={movies} />

      <div className="search__end" ref={ref}>
        {isFetchingNextPage && <div>Loading more....</div>}
        {movies?.length > 0 && !hasNextPage && <div>That's all</div>}
      </div>
    </>
  );
};
export default InfiniteMovieContainer;
