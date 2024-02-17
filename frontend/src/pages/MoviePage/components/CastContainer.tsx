import { useState } from "react";
import { Movie } from "../../../../types";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";
import Person from "./Person";

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

export default CastContainer;
