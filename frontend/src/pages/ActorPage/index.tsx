import { getFullSizeImageUrl } from "../../../utils";
import { useParams } from "react-router";
import { useMemo } from "react";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";
import useFetchActor from "./hooks/useFetchActor";
import MovieList from "./components/MovieList";

import "./index.scss";

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
