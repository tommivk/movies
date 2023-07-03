import { Movie } from "../../types.ts";
import "./movieCard.scss";

type Props = { movie: Movie };

const MovieCard = ({ movie }: Props) => {
  const imagePath = movie.posterPath ?? movie.backdropPath;
  const bgImage = imagePath
    ? `https://image.tmdb.org/t/p/original/${imagePath}`
    : "https://files.worldwildlife.org/wwfcmsprod/images/Panda_in_Tree/story_full_width/8u3k0zn66i_Large_WW170579.jpg";

  const year = new Date(movie.releaseDate).getFullYear();

  return (
    <div className="card">
      <div className="card__imageContainer">
        <img className="card__image" src={bgImage} alt={movie.title}></img>
        <div className="card__fade" />
        <h2 className="card__title">{movie.title}</h2>
      </div>
      <div className="card__bottom">
        <div className="card__details">
          <div className="card__genres">
            {movie.genres?.map((genre) => (
              <span className="card__genre">{genre.name}</span>
            ))}
          </div>
          <span className="card__year">{year}</span>
        </div>
        <p className="card__overview">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;
