import { Movie } from "../../../types";
import MovieCard from "../MovieCard/MovieCard";

import "./movieList.scss";

const MovieList = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="movieList">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
