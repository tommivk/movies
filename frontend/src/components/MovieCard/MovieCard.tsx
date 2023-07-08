import { Link } from "react-router-dom";
import { Movie } from "../../../types.js";
import { getImageUrl } from "../../../utils.js";

import "./movieCard.scss";

type Props = { movie: Movie };

const placeHolderImg =
  "https://files.worldwildlife.org/wwfcmsprod/images/Panda_in_Tree/story_full_width/8u3k0zn66i_Large_WW170579.jpg";

const MovieCard = ({ movie }: Props) => {
  const imagePath = movie.posterPath ?? movie.backdropPath;
  const image = imagePath ? getImageUrl(imagePath) : placeHolderImg;

  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : undefined;

  return (
    <Link className="link link--unset" to={`/movies/${movie.id}`}>
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
