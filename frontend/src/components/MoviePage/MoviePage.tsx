import { Link, useParams } from "react-router-dom";
import {
  getFullSizeImageUrl,
  getSmallProfileImageUrl,
  runtimeToString,
} from "../../../utils";
import { Cast, Movie } from "../../../types";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import useAppStore from "../../store";
import Modal from "../Modal/Modal";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import Button from "../Button/Button";
import RatingStars from "../RatingStars/RatingStars";
import useToggleFavourite from "../../hooks/useToggleFavourite";
import useAddRating from "../../hooks/useAddRating";
import useUpdateRating from "../../hooks/useUpdateRating";
import useCacheImage from "../../hooks/useCacheImage";
import useFetchMovie from "../../hooks/useFetchMovie";
import PosterCard from "../PosterCard/PosterCard";
import Swiper from "../Swiper/Swiper";
import RatingCircle from "../RatingCircle/RatingCircle";

import "./moviePage.scss";

const Rating = ({
  rating,
  text,
  userRating,
}: {
  rating?: string;
  text: string;
  userRating?: boolean;
}) => {
  return (
    <div className="rating">
      <RatingCircle rating={rating} userRating={userRating} />
      <p>{text}</p>
    </div>
  );
};

const RatingModal = ({
  open,
  setOpen,
  userRating,
}: {
  userRating?: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState<number | undefined>(userRating);
  const token = useAppStore().loggedUser?.token;

  const { mutate: updateRating } = useUpdateRating();
  const handleUpdateRating = async () => {
    updateRating({ rating, movieId, token });
    setOpen(false);
  };
  const { mutate: addRating } = useAddRating();
  const handleAddRating = async () => {
    addRating({ rating, movieId, token });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title={userRating ? "Update your rating" : "Rate this movie"}
    >
      <div className="ratingModal">
        <RatingStars
          selected={rating}
          onChange={(rating) => setRating(rating)}
        />
        <Button
          disabled={!rating || rating === userRating}
          onClick={() =>
            userRating ? handleUpdateRating() : handleAddRating()
          }
        >
          {userRating ? "Update" : "Rate"}
        </Button>
      </div>
    </Modal>
  );
};

const Ratings = ({ movie }: { movie: Movie }) => {
  const [open, setOpen] = useState(false);
  const store = useAppStore();
  const userRating = store.ratings?.find(
    ({ movieId }) => movieId == Number(movie.id)
  )?.rating;
  const siteRating = movie.voteSiteAverage?.toFixed(1);
  const tmdbRating = movie.voteAverage?.toFixed(1);

  const handleModalOpen = () => {
    if (!store.loggedUser) {
      return toast.error("You must be logged in to rate movies");
    }
    setOpen(true);
  };

  return (
    <div className="movie__ratings">
      <RatingModal open={open} setOpen={setOpen} userRating={userRating} />
      <Rating rating={tmdbRating} text="TMDB" />
      <Rating rating={siteRating} text="Mövies" />
      <div className="movie__userRating" onClick={handleModalOpen}>
        <Rating rating={userRating?.toFixed(1)} userRating text="Your rating" />
      </div>
    </div>
  );
};

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

          <div
            className="movie__favourite"
            role="button"
            onClick={() => toggleFavourite()}
          >
            <span
              className={`movie__heart ${
                isFavourited ? "movie__heart--striked" : ""
              }`}
            >
              ♡
            </span>
            <span>
              {isFavourited ? "Remove from favourites" : "Add to favourites"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Person = ({ person }: { person: Cast }) => {
  const placeholder = (
    <div className="person__image">
      <div className="person__placeholder">👤</div>
    </div>
  );
  return (
    <Link className="link" to={`/actors/${person.id}`}>
      <div className="person">
        {person.profilePath ? (
          <img
            className="person__image"
            src={getSmallProfileImageUrl(person.profilePath)}
          />
        ) : (
          placeholder
        )}
        <div className="person__details">
          <h3 className="person__name">{person.name}</h3>
          <p className="person__character">{person.character}</p>
        </div>
      </div>
    </Link>
  );
};

const CastContainer = ({ movie }: { movie: Movie }) => {
  const [showFullCast, setShowFullCast] = useState(false);
  const castLength = movie.credits?.cast?.length ?? 0;

  if (castLength === 0) return <></>;

  return (
    <div className="cast">
      <Modal
        title="Cast"
        open={showFullCast}
        onClose={() => setShowFullCast(false)}
      >
        <div className="cast__modal">
          {movie.credits?.cast.map((person) => (
            <Person person={person} key={person.id} />
          ))}
        </div>
      </Modal>

      <div className="cast__top">
        <h1>Top Cast</h1>
        {castLength > 6 && (
          <button
            className={`cast__btn btn--transparent ${
              showFullCast ? "cast__btn--close" : ""
            }`}
            onClick={() => setShowFullCast(!showFullCast)}
          >
            {showFullCast ? "Hide full cast" : "Show full cast"}
          </button>
        )}
      </div>

      <div className="cast__list">
        {movie.credits?.cast.slice(0, 6).map((person) => (
          <Person person={person} key={person.id} />
        ))}
      </div>
    </div>
  );
};

const Recommendations = ({ movie }: { movie: Movie }) => {
  const slides = useMemo(
    () =>
      movie?.recommendations?.results.map((movie) => (
        <PosterCard movie={movie} />
      )),
    [movie]
  );

  return (
    <>
      {slides && slides.length > 0 && (
        <>
          <h1>People also liked</h1>
          <Swiper slides={slides}></Swiper>
        </>
      )}
    </>
  );
};

const MoviePage = () => {
  const { id } = useParams();
  const { data: movie, isLoading, isError, error } = useFetchMovie({ id });
  const backdrop = movie?.backdropPath ?? "";
  const [imageLoaded] = useCacheImage(getFullSizeImageUrl(backdrop));
  const backdropLoading = backdrop && !imageLoaded;

  if (isError) {
    console.log(error);
    return <p>Error</p>;
  }
  if (isLoading || backdropLoading) {
    return <LoadingContainer />;
  }

  return (
    <div className="movie">
      <TopSection movie={movie} />
      <div className="movie__bottomSection">
        <CastContainer movie={movie} />
        <Recommendations movie={movie} />
      </div>
    </div>
  );
};

export default MoviePage;
