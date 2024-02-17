import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";
import useAddRating from "../hooks/useAddRating";
import useUpdateRating from "../hooks/useUpdateRating";
import useAppStore from "../../../store";
import RatingStars from "./RatingStars";

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

export default RatingModal;
