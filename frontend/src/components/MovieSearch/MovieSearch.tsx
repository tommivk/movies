import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { SearchResult } from "../../../types";
import MovieCard from "../MovieCard/MovieCard";
import camelcaseKeys from "camelcase-keys";

import "./movieSearch.scss";

const BASE_URL = "http://localhost:8080";

const fetchData = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return camelcaseKeys(data, { deep: true });
};

const MovieList = ({ data }: { data: SearchResult }) => {
  return (
    <div className="search__result">
      {data.results.map((movie) => (
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
  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchMovies", debouncedSearch],
    queryFn: (): Promise<SearchResult> =>
      fetchData(`${BASE_URL}/movies/search?q=${debouncedSearch}`),
  });

  if (isError) {
    console.error({ error });
    if (error instanceof Error) {
      return <p>Error happened: {error.message}</p>;
    }
    return <p>Error</p>;
  }

  console.log(data);

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
      {isLoading ? (
        <p className="search__info">Loading</p>
      ) : (
        <MovieList data={data} />
      )}
      {data && data.results.length === 0 && (
        <p className="search__info">No results found</p>
      )}
    </div>
  );
};

export default MovieSearch;
