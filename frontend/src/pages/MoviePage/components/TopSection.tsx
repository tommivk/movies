import { Movie } from "../../../../types";
import { getFullSizeImageUrl, runtimeToString } from "../../../../utils";
import Button from "../../../components/Button/Button";
import useToggleFavourite from "../hooks/useToggleFavourite";
import useAppStore from "../../../store";
import Ratings from "./Ratings";
import RecommendationModal from "./RecommendationModal";

const TopSection = ({ movie }: { movie: Movie }) => {
  const year = new Date(movie.releaseDate).getFullYear();
  const imgSrc = getFullSizeImageUrl(movie.backdropPath);
  const store = useAppStore();
  const favouritedMovieIds = store.favouritedMovieIds;
  const isFavourited = favouritedMovieIds?.some(
    (movieId) => movieId === Number(movie.id)
  );
  const { mutate: toggleFavourite } = useToggleFavourite({
    isFavourited,
    movie,
    token: store.loggedUser?.token,
  });

  return (
    <div className="movie__topSection">
      {imgSrc ? (
        <img alt={movie.title} className="movie__image" src={imgSrc}></img>
      ) : (
        <div className="movie__image movie__imagePlaceholder" />
      )}
      <div className="movie__details">
        <h1 className="movie__title">{movie.title}</h1>
        <div className="movie__info">
          <h3>{year}</h3>
          <h3 className="movie__runtime">{runtimeToString(movie.runtime)}</h3>
        </div>
        <p className="movie__overview">{movie.overview}</p>

        <div className="movie__bottom">
          <Ratings movie={movie} />

          <div className="movie__userActions">
            <Button onClick={() => toggleFavourite()} data-cy="favouriteBtn">
              <span className={`icon ${isFavourited ? "icon--striked" : ""}`}>
                ♡
              </span>
              <span>
                {isFavourited ? "Remove from favourites" : "Add to favourites"}
              </span>
            </Button>
            <RecommendationModal movieId={movie.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
