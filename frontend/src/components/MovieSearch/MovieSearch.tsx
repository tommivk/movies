import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Movie, SearchResult } from "../../../types";
import { fetchData } from "../../../utils.ts";
import MovieCard from "../MovieCard/MovieCard";

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
        <MovieCard movie={movie} />
      ))}
      <div className="search__pseudoEl" />
      <div className="search__pseudoEl" />
      <div className="search__pseudoEl" />
    </div>
  );
};

const MovieSearch = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 500);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchMovies", debouncedSearch],
    queryFn: (): Promise<SearchResult> =>
      fetchData(`${BASE_URL}/movies/search?q=${debouncedSearch}`),
    enabled: Boolean(debouncedSearch),
  });

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
        movies={data?.results ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </div>
  );
};

export default MovieSearch;
