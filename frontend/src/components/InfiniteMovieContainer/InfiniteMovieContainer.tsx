import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { SearchResult } from "../../../types";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import MovieList from "../MovieList/MovieList";
import Loading from "../Loading/Loading";
import LoadingContainer from "../LoadingContainer/LoadingContainer";

import "./infiniteMovieContainer.scss";

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
    return <LoadingContainer />;
  }

  if (movies.length === 0) {
    return <p className="search__info">No results found</p>;
  }

  return (
    <>
      <MovieList movies={movies} />

      <div className="searchEnd" ref={ref}>
        {isFetchingNextPage && <Loading size="sm" />}
        {movies?.length > 0 && !hasNextPage && <div>That's all</div>}
      </div>
    </>
  );
};

export default InfiniteMovieContainer;
