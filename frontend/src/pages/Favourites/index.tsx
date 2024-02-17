import { useState } from "react";
import Button from "../../components/Button/Button";
import InfiniteMovieContainer from "../../components/InfiniteMovieContainer/InfiniteMovieContainer";
import useAppStore from "../../store";
import useInfiniteFavouritedMovies from "./hooks/useInfiniteFavouritedMovies";

import "./index.scss";

const Favourites = () => {
  const [show, setShow] = useState<"all" | "rated" | "unrated">("all");

  const store = useAppStore();
  const { userId, token } = store.loggedUser ?? {};
  const movieIds = store.favouritedMovieIds;

  const favouritesResult = useInfiniteFavouritedMovies({
    userId,
    token,
    movieIds,
    show,
  });

  return (
    <>
      <h1 className="favourites__title">Your Favourited Movies</h1>
      <div className="favourites__buttons">
        <Button
          active={show == "all"}
          size="sm"
          color="transparent"
          onClick={() => setShow("all")}
        >
          All
        </Button>
        <Button
          active={show == "rated"}
          size="sm"
          color="transparent"
          onClick={() => setShow("rated")}
        >
          Rated
        </Button>
        <Button
          active={show == "unrated"}
          size="sm"
          color="transparent"
          onClick={() => setShow("unrated")}
        >
          Unrated
        </Button>
      </div>
      <InfiniteMovieContainer queryResult={favouritesResult} />
    </>
  );
};

export default Favourites;
