import { useMemo } from "react";
import Swiper from "../../../components/Swiper/Swiper";
import { Movie } from "../../../../types";
import PosterCard from "../../../components/PosterCard/PosterCard";

const Recommendations = ({ movie }: { movie: Movie }) => {
  const slides = useMemo(
    () =>
      movie?.recommendations?.results
        .filter((movie) => movie.releaseDate && movie.posterPath)
        .map((movie) => <PosterCard movie={movie} />),
    [movie]
  );

  return (
    <>
      {slides && slides.length > 0 && (
        <>
          <h1 data-cy="recommendations">People also liked</h1>
          <Swiper slides={slides}></Swiper>
        </>
      )}
    </>
  );
};

export default Recommendations;
