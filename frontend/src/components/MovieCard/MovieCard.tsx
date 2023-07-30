import { Link } from "react-router-dom";
import { Movie } from "../../../types.js";
import { getBackdropImageUrl, getPosterImageUrl } from "../../../utils.js";

import "./movieCard.scss";

type Props = { movie: Movie };

const placeHolderImg = import.meta.env.VITE_PLACEHOLDER_IMAGE;

const MovieCard = ({ movie }: Props) => {
  const image =
    getBackdropImageUrl(movie.backdropPath, "md") ??
    getPosterImageUrl(movie.posterPath, "md") ??
    placeHolderImg;

  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : undefined;

  return (
    <Link className="link" to={`/movies/${movie.id}`} data-cy="movieCard">
      <div className="card">
        {movie.voteAverage && (
          <div className="card__rating">{movie.voteAverage.toFixed(1)}</div>
        )}
        <div className="card__imageWrapper">
          <img className="card__image" src={image} alt={movie.title}></img>
          <div className="card__fade--top" />
          <div className="card__fade--bottom" />
          <h2 className="card__title">{movie.title}</h2>
        </div>
        <div className="card__bottom">
          <div className="card__details">
            <div className="card__genres">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="card__genre">
                  {genre.name}
                </span>
              ))}
            </div>
            <span className="card__year">{year}</span>
          </div>
          <p className="card__overview">{movie.overview}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
