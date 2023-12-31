import { Link, useParams } from "react-router-dom";
import {
  fetchData,
  getFullSizeImageUrl,
  getProfileImageUrl,
  runtimeToString,
} from "../../../utils";
import { Cast, Movie } from "../../../types";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import useAppStore from "../../store";
import Modal from "../Modal/Modal";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import Button from "../Button/Button";
import RatingStars from "../RatingStars/RatingStars";
import useToggleFavourite from "../../hooks/useToggleFavourite";
import useAddRating from "../../hooks/useAddRating";
import useUpdateRating from "../../hooks/useUpdateRating";
import useCacheImage from "../../hooks/useCacheImage";
import useFetchMovie from "../../hooks/useFetchMovie";
import PosterCard from "../PosterCard/PosterCard";
import Swiper from "../Swiper/Swiper";
import RatingCircle from "../RatingCircle/RatingCircle";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLabel from "../FormLabel/FormLabel";
import FormFieldError from "../FormFieldError/FormFieldError";
import FormSelect from "../FormSelect/FormSelect";

import "./moviePage.scss";

const Rating = ({
  rating,
  text,
  userRating,
}: {
  rating?: string;
  text: string;
  userRating?: boolean;
}) => {
  return (
    <div className="rating">
      <RatingCircle rating={rating} userRating={userRating} />
      <p>{text}</p>
    </div>
  );
};

const RatingModal = ({
  open,
  setOpen,
  userRating,
}: {
  userRating?: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState<number | undefined>(userRating);
  const token = useAppStore().loggedUser?.token;

  const { mutate: updateRating } = useUpdateRating();
  const handleUpdateRating = async () => {
    updateRating({ rating, movieId, token });
    setOpen(false);
  };
  const { mutate: addRating } = useAddRating();
  const handleAddRating = async () => {
    addRating({ rating, movieId, token });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title={userRating ? "Update your rating" : "Rate this movie"}
    >
      <div className="ratingModal">
        <RatingStars
          selected={rating}
          onChange={(rating) => setRating(rating)}
        />
        <Button
          disabled={!rating || rating === userRating}
          onClick={() =>
            userRating ? handleUpdateRating() : handleAddRating()
          }
        >
          {userRating ? "Update" : "Rate"}
        </Button>
      </div>
    </Modal>
  );
};

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

const RecommmendationForm = ({
  movieId,
  closeModal,
}: {
  movieId: number;
  closeModal: () => void;
}) => {
  const { token } = useAppStore().loggedUser ?? {};
  const groups = useAppStore().groups;

  const { mutate } = useMutation({
    mutationKey: ["addRecommendation"],
    mutationFn: (body: {
      groupId: number;
      movieId: number;
      description: string;
    }) =>
      fetchData({
        path: "/groups/recommendations",
        method: "POST",
        body,
        token,
      }),
    onSuccess: () => toast.success("Recommendation submitted!"),
    onError: (error: Error) => toast.error(error.message),
  });

  const schema = z.object({
    groupId: z.number({ required_error: "Group is required" }),
    description: z.string().min(1, "Description is required"),
  });
  type FormSchema = z.infer<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const selectOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <form
      className="recommendationForm"
      onSubmit={handleSubmit((data) =>
        mutate(
          { ...data, movieId },
          {
            onSuccess: () => {
              reset();
              closeModal();
            },
          }
        )
      )}
    >
      <FormLabel>Group</FormLabel>
      <Controller
        control={control}
        name="groupId"
        render={({ field: { onChange } }) => (
          <FormSelect options={selectOptions} onChange={onChange} />
        )}
      />
      <FormFieldError message={errors.groupId?.message} />

      <FormLabel>Description</FormLabel>
      <textarea
        className="recommendationForm__textArea"
        rows={5}
        spellCheck="false"
        {...register("description")}
      />
      <FormFieldError message={errors.description?.message} />

      <Button type="submit">Submit</Button>
    </form>
  );
};

const RecommendationModal = ({ movieId }: { movieId: number }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const groups = useAppStore().groups;
  const { userId } = useAppStore().loggedUser ?? {};
  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Recommend movie"
      >
        <RecommmendationForm
          movieId={movieId}
          closeModal={() => setModalOpen(false)}
        />
      </Modal>
      <Button
        onClick={() => {
          if (!userId) {
            return toast.error("You must be logged in to recommend movies");
          }
          if (groups.length === 0) {
            return toast.error("You don't belong in any groups");
          }
          setModalOpen(true);
        }}
      >
        <span className="icon">💬</span>
        Recommend Movie
      </Button>
    </>
  );
};

const TopSection = ({ movie }: { movie: Movie }) => {
  const year = new Date(movie.releaseDate).getFullYear();
  const imgSrc = getFullSizeImageUrl(movie.backdropPath);
  const store = useAppStore();
  const favouritedMovieIds = store.favouritedMovieIds;
  const isFavourited = favouritedMovieIds?.some(
    (movieId) => movieId === Number(movie.id)
  );
  const { mutate: toggleFavourite } = useToggleFavourite({
    isFavourited,
    movie,
    token: store.loggedUser?.token,
  });

  return (
    <div className="movie__topSection">
      {imgSrc ? (
        <img alt={movie.title} className="movie__image" src={imgSrc}></img>
      ) : (
        <div className="movie__image movie__imagePlaceholder" />
      )}
      <div className="movie__details">
        <h1 className="movie__title">{movie.title}</h1>
        <div className="movie__info">
          <h3>{year}</h3>
          <h3 className="movie__runtime">{runtimeToString(movie.runtime)}</h3>
        </div>
        <p className="movie__overview">{movie.overview}</p>

        <div className="movie__bottom">
          <Ratings movie={movie} />

          <div className="movie__userActions">
            <Button onClick={() => toggleFavourite()} data-cy="favouriteBtn">
              <span className={`icon ${isFavourited ? "icon--striked" : ""}`}>
                ♡
              </span>
              <span>
                {isFavourited ? "Remove from favourites" : "Add to favourites"}
              </span>
            </Button>

            <RecommendationModal movieId={movie.id} />
          </div>
        </div>
      </div>
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
    <Link className="link" to={`/actors/${person.id}`}>
      <div className="person">
        {person.profilePath ? (
          <img
            className="person__image"
            src={getProfileImageUrl(person.profilePath, "xs")}
          />
        ) : (
          placeholder
        )}
        <div className="person__details">
          <h3 className="person__name">{person.name}</h3>
          <p className="person__character">
            {person.character ? person.character : person.job}
          </p>
        </div>
      </div>
    </Link>
  );
};

const CastContainer = ({ movie }: { movie: Movie }) => {
  const [showFullCast, setShowFullCast] = useState(false);
  const [showCast, setShowCast] = useState(true);
  const castLength = movie.credits?.cast?.length ?? 0;

  if (castLength === 0) return <></>;

  return (
    <div className="cast">
      <Modal
        title="Cast And Crew"
        open={showFullCast}
        onClose={() => setShowFullCast(false)}
      >
        <div className="cast__modal">
          <div className="cast__modal__buttons">
            <Button
              color="transparent"
              active={showCast}
              onClick={() => setShowCast(true)}
            >
              Cast
            </Button>
            <Button
              color="transparent"
              active={!showCast}
              onClick={() => setShowCast(false)}
            >
              Crew
            </Button>
          </div>
          <div className="cast__modal__results">
            {showCast
              ? movie.credits?.cast.map((person, index) => (
                  <Person key={index} person={person} />
                ))
              : movie.credits?.crew.map((person, index) => (
                  <Person key={index} person={person} />
                ))}
          </div>
        </div>
      </Modal>

      <div className="cast__top">
        <h1>Top Cast</h1>
        {castLength > 6 && (
          <button
            className="cast__btn btn--transparent"
            onClick={() => setShowFullCast(true)}
          >
            Show Full Cast And Crew
          </button>
        )}
      </div>

      <div className="cast__list" data-cy="movieTopCast">
        {movie.credits?.cast.slice(0, 6).map((person) => (
          <Person person={person} key={person.id} />
        ))}
      </div>
    </div>
  );
};

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
