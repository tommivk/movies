import MovieCard from "../MovieCard/MovieCard";
import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { Movie, SearchResult } from "../../../types";
import { fetchData } from "../../../utils.ts";
import { useInView } from "react-intersection-observer";

import "./movieSearch.scss";

const MovieList = ({
  movies,
  isLoading,
  isError,
  error,
}: {
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}) => {
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
    <div className="search__result">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      <div className="search__pseudoEl" />
      <div className="search__pseudoEl" />
      <div className="search__pseudoEl" />
    </div>
  );
};

const SearchResults = ({
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

  return (
    <div className="search__container">
      {enabled && (
        <MovieList
          movies={movies}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      )}

      <div className="search__end" ref={ref}>
        {isFetchingNextPage && <div>Loading more....</div>}
        {movies?.length > 0 && !hasNextPage && <div>That's all</div>}
      </div>
    </div>
  );
};

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

const useInfiniteTrendingMovieSearch = () => {
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

const MovieSearch = () => {
  const [page, setPage] = useState<"search" | "trending">("trending");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 500);

  const searchResult = useInfiniteMovieSearch(debouncedSearch);
  const trendingResult = useInfiniteTrendingMovieSearch();

  return (
    <>
      <input
        type="text"
        placeholder="Search all movies..."
        className="search__input"
        autoComplete="false"
        autoCorrect="false"
        value={search}
        onChange={({ target: { value } }) => {
          setSearch(value);
          setPage("search");
        }}
      ></input>

      <div className="search__buttons">
        <button
          className={`search__btn
                      ${page === "trending" ? "search__btn--active" : ""}
                    `}
          onClick={() => {
            setPage("trending");
            setSearch("");
          }}
        >
          Trending
        </button>
      </div>

      {page == "trending" && (
        <>
          <h1 className="search__title">Trending movies this week</h1>
          <SearchResults queryResult={trendingResult} />
        </>
      )}
      {page == "search" && (
        <SearchResults queryResult={searchResult} enabled={!!debouncedSearch} />
      )}
    </>
  );
};

export default MovieSearch;
