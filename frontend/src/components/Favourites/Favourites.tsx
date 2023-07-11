import useAppStore from "../../store";
import InfiniteMovieContainer from "../InfiniteMovieContainer/InfiniteMovieContainer";
import useInfiniteFavouritedMovies from "../../hooks/useInfiniteFavouritedMovies";

import "./favourites.scss";

const Favourites = () => {
  const store = useAppStore();
  const { userId, token } = store.loggedUser ?? {};
  const movieIds = store.favouritedMovieIds;
  const favouritesResult = useInfiniteFavouritedMovies(userId, token, movieIds);

  return (
    <>
      <h1 className="favourited__title">Your Favourited Movies</h1>
      <InfiniteMovieContainer queryResult={favouritesResult} />
    </>
  );
};

export default Favourites;
