import { useParams } from "react-router-dom";
import { getFullSizeImageUrl } from "../../../utils";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";
import useCacheImage from "../../hooks/useCacheImage";
import useFetchMovie from "./hooks/useFetchMovie";
import Recommendations from "./components/Recommendations";
import TopSection from "./components/TopSection";
import CastContainer from "./components/CastContainer";

import "./index.scss";

const MoviePage = () => {
  const { id } = useParams();
  const { data: movie, isLoading, isError, error } = useFetchMovie({ id });
  const backdrop = movie?.backdropPath ?? "";
  const [imageLoaded] = useCacheImage(getFullSizeImageUrl(backdrop));
  const backdropLoading = backdrop && !imageLoaded;

  if (isError) {
    console.log(error);
    return <p>Error</p>;
  }
  if (isLoading || backdropLoading) {
    return <LoadingContainer />;
  }

  return (
    <div className="movie">
      <TopSection movie={movie} />
      <div className="movie__bottomSection">
        <CastContainer movie={movie} />
        <Recommendations movie={movie} />
      </div>
    </div>
  );
};

export default MoviePage;
