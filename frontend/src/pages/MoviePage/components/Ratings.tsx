import { useState } from "react";
import { toast } from "react-toastify";
import { Movie } from "../../../../types";
import useAppStore from "../../../store";
import Rating from "./Rating";
import RatingModal from "./RatingModal";

const Ratings = ({ movie }: { movie: Movie }) => {
  const [open, setOpen] = useState(false);
  const store = useAppStore();
  const userRating = store.ratings?.find(
    ({ movieId }) => movieId == Number(movie.id)
  )?.rating;
  const siteRating = movie.voteSiteAverage?.toFixed(1);
  const tmdbRating = movie.voteAverage?.toFixed(1);

  const handleModalOpen = () => {
    if (!store.loggedUser) {
      return toast.error("You must be logged in to rate movies");
    }
    setOpen(true);
  };

  return (
    <div className="movie__ratings">
      <RatingModal open={open} setOpen={setOpen} userRating={userRating} />
      <Rating rating={tmdbRating} text="TMDB" />
      <Rating rating={siteRating} text="Mövies" />
      <div className="movie__userRating" onClick={handleModalOpen}>
        <Rating rating={userRating?.toFixed(1)} userRating text="Your rating" />
      </div>
    </div>
  );
};

export default Ratings;
