import { useState } from "react";
import { useDebounce } from "use-debounce";
import InfiniteMovieContainer from "../InfiniteMovieContainer/InfiniteMovieContainer.tsx";
import useInfiniteMovieSearch from "../../hooks/useInfiniteMovieSearch.tsx";
import useInfiniteTopRatedMovies from "../../hooks/useInfiniteTopRatedMovies.tsx";
import useInfiniteTrendingMovies from "../../hooks/useInfiniteTrendingMovies.tsx";
import Button from "../Button/Button.tsx";
import SearchInput from "../SearchInput/SearchInput.tsx";

import "./movieSearch.scss";

const MovieSearch = () => {
  const [page, setPage] = useState<"search" | "trending" | "top" | "fav">(
    "trending"
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 500);

  const searchResult = useInfiniteMovieSearch(debouncedSearch);
  const trendingResult = useInfiniteTrendingMovies();
  const topRatedResult = useInfiniteTopRatedMovies();

  return (
    <div className="search">
      <SearchInput
        type="text"
        placeholder="Search all movies..."
        autoComplete="false"
        autoCorrect="false"
        value={search}
        onChange={({ target: { value } }) => {
          setSearch(value);
          setPage("search");
        }}
      ></SearchInput>

      <div className="search__buttons">
        <Button
          color="transparent"
          size="sm"
          active={page === "trending"}
          onClick={() => {
            setPage("trending");
            setSearch("");
          }}
        >
          Trending
        </Button>
        <Button
          color="transparent"
          size="sm"
          active={page == "top"}
          onClick={() => {
            setPage("top");
            setSearch("");
          }}
        >
          Top Rated
        </Button>
      </div>

      {page == "trending" && (
        <>
          <h1 className="search__title">Trending movies on TMDB this week</h1>
          <InfiniteMovieContainer queryResult={trendingResult} />
        </>
      )}
      {page == "top" && (
        <>
          <h1 className="search__title">Top rated movies on TMDB</h1>
          <InfiniteMovieContainer queryResult={topRatedResult} />
        </>
      )}
      {page == "search" && (
        <InfiniteMovieContainer
          queryResult={searchResult}
          enabled={!!debouncedSearch}
        />
      )}
    </div>
  );
};

export default MovieSearch;
