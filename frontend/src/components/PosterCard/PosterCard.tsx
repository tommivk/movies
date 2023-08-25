import { Link } from "react-router-dom";
import { Movie } from "../../../types";
import { getBackdropImageUrl, getPosterImageUrl } from "../../../utils";
import classNames from "classnames";

import "./posterCard.scss";

const BASE_URL = import.meta.env.VITE_IMGIX_BASE_URL;
const placeholderImg = `${BASE_URL}/placeholder.png`;

type Props = {
  movie: Movie;
  size?: "sm" | "md";
};

const PosterCard = ({ movie, size = "md" }: Props) => {
  const image =
    getPosterImageUrl(movie.posterPath, "md") ??
    getBackdropImageUrl(movie.backdropPath, "md") ??
    placeholderImg;
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : undefined;

  return (
    <Link className="link" to={`/movies/${movie.id}`}>
      <div className={classNames("posterCard", { [size]: size })}>
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
