import { getFullSizeImageUrl, getPosterImageUrl } from "../../../utils";
import { useParams } from "react-router";
import { ActorMovie } from "../../../types";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import useFetchActor from "../../hooks/useFetchActor";

import "./actorPage.scss";

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

const ActorPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useFetchActor({ id });

  const movies = useMemo(() => {
    return (
      data?.movieCredits.cast
        .filter((movie) => movie.releaseDate)
        .sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        ) ?? []
    );
  }, [data]);

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }
  if (isLoading) return <LoadingContainer />;

  const imgSrc = getFullSizeImageUrl(data.profilePath);

  return (
    <div className="actor">
      <div className="actor__topSection">
        <img className="actor__image" alt={data.name} src={imgSrc}></img>
        <div className="actor__details">
          <h1 className="actor__name">{data.name}</h1>
          <p className="actor__biography">{data.biography}</p>
        </div>
      </div>
      <MovieList movies={movies} />
    </div>
  );
};

export default ActorPage;
