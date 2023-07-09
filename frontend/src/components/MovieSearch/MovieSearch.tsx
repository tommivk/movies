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

const MovieList = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="movieList">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      <div className="movieList__pseudoEl" />
      <div className="movieList__pseudoEl" />
      <div className="movieList__pseudoEl" />
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

const MovieSearch = () => {
  const [page, setPage] = useState<"search" | "trending" | "top">("trending");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 500);

  const searchResult = useInfiniteMovieSearch(debouncedSearch);
  const trendingResult = useInfiniteTrendingMovies();
  const topRatedResult = useInfiniteTopRatedMovies();

  return (
    <div className="search__container">
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
        <button
          className={`search__btn
                      ${page === "top" ? "search__btn--active" : ""}
                    `}
          onClick={() => {
            setPage("top");
            setSearch("");
          }}
        >
          Top Rated
        </button>
      </div>

      {page == "trending" && (
        <>
          <h1 className="search__title">Trending movies on TMDB this week</h1>
          <SearchResults queryResult={trendingResult} />
        </>
      )}
      {page == "top" && (
        <>
          <h1 className="search__title">Top rated movies on TMDB</h1>
          <SearchResults queryResult={topRatedResult} />
        </>
      )}
      {page == "search" && (
        <SearchResults queryResult={searchResult} enabled={!!debouncedSearch} />
      )}
    </div>
  );
};

export default MovieSearch;
