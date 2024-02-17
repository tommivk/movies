import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";
import useAppStore from "../../../store";
import RecommmendationForm from "./RecommendationForm";

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

export default RecommendationModal;
