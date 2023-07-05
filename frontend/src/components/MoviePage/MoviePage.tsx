import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData, getImageUrl, runtimeToString } from "../../../utils";
import { Cast, Movie } from "../../../types";
import { useState } from "react";

import "./moviePage.scss";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const MoviePage = () => {
  const [showFullCast, setShowFullCast] = useState(false);
  const { id } = useParams();
  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetchMovie", id],
    queryFn: (): Promise<Movie> => fetchData(`${BASE_URL}/movies/${id}`),
  });

  if (isError) {
    console.log(error);
    return <p>Error</p>;
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }
  console.log(movie);

  const bgImage = movie?.backdropPath ? getImageUrl(movie.backdropPath) : "";
  const year = new Date(movie.releaseDate).getFullYear();
  const castLength = movie.credits?.cast?.length ?? 0;

  return (
    <div>
      <img alt={movie.title} className="movie__image" src={bgImage}></img>

      <div className="movie__details">
        <h1 className="movie__title">{movie.title}</h1>
        <div className="movie__info">
          <h3>{year}</h3>
          <h3 className="movie__runtime">{runtimeToString(movie.runtime)}</h3>
        </div>
        <p className="movie__overview">{movie.overview}</p>
      </div>

      {castLength > 0 && (
        <div className="cast__container">
          <h1>Cast</h1>

          <div className="cast__list">
            {movie.credits?.cast
              .slice(0, !showFullCast && castLength >= 6 ? 6 : undefined)
              .map((person) => (
                <Person person={person} key={person.id} />
              ))}
          </div>
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
      )}
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
    <div className="person__container">
      {person.profilePath ? (
        <img className="person__image" src={getImageUrl(person.profilePath)} />
      ) : (
        placeholder
      )}
      <div className="person__details">
        <h3 className="person__name">{person.name}</h3>
        <p className="person__character">{person.character}</p>
      </div>
    </div>
  );
};

export default MoviePage;
