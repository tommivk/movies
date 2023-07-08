import MovieCard from "../MovieCard/MovieCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { Movie } from "../../../types";
import { fetchData } from "../../../utils.ts";
import { useInView } from "react-intersection-observer";

import "./movieSearch.scss";

const BASE_URL = "http://localhost:8080";

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

const MovieSearch = () => {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 500);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["movieSearch", debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      fetchData(
        `${BASE_URL}/movies/search?q=${debouncedSearch}&page=${pageParam}`
      ),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const movies =
    useMemo(() => data?.pages.flatMap((page) => page.results), [data]) ?? [];

  return (
    <div className="search__container">
      <input
        type="text"
        placeholder="Search movies..."
        className="search__input"
        autoComplete="false"
        autoCorrect="false"
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
      ></input>

      <MovieList
        movies={movies}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <div className="search__end" ref={ref}>
        {isFetchingNextPage && <div>Loading more....</div>}
        {movies?.length > 0 && !hasNextPage && <div>That's all</div>}
      </div>
    </div>
  );
};

export default MovieSearch;
