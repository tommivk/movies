import { Link } from "react-router-dom";
import { ActorMovie } from "../../../../types";
import { getPosterImageUrl } from "../../../../utils";

const MovieList = ({ movies }: { movies: ActorMovie[] }) => {
  return (
    <div className="actor__movies">
      <h1>Movies</h1>

      {movies?.map((movie) => {
        const imageSrc = getPosterImageUrl(movie.posterPath, "sm");
        const year = movie.releaseDate
          ? new Date(movie.releaseDate).getFullYear()
          : "";

        return (
          <Link
            key={movie.id}
            className="link actor__movie__link"
            to={`/movies/${movie.id}`}
          >
            <div className="actor__movie">
              {imageSrc ? (
                <img className="actor__movie__image" src={imageSrc} />
              ) : (
                <div className="actor__movie__image__placeholder" />
              )}
              <div className="actor__movie__details">
                <h1>{movie.title}</h1>
                <p>{year}</p>
                <p>{movie.character}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MovieList;
