import { Link } from "react-router-dom";
import { Movie } from "../../../types";
import { getBackdropImageUrl, getPosterImageUrl } from "../../../utils";

import "./posterCard.scss";

type Props = {
  movie: Movie;
};

const BASE_URL = import.meta.env.VITE_IMGIX_BASE_URL;
const placeholderImg = `${BASE_URL}/placeholder.png`;

const PosterCard = ({ movie }: Props) => {
  const image =
    getPosterImageUrl(movie.posterPath, "md") ??
    getBackdropImageUrl(movie.backdropPath, "md") ??
    placeholderImg;
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : undefined;

  return (
    <Link className="link" to={`/movies/${movie.id}`}>
      <div className="posterCard">
        <img alt={movie.title} src={image} />
        <h1>{movie.title}</h1>
        <p>
          {movie.genres?.slice(0, 1).map(({ name }) => (
            <span key={name}>{name}</span>
          ))}
          {year && <span>{year}</span>}
        </p>
      </div>
    </Link>
  );
};

export default PosterCard;
