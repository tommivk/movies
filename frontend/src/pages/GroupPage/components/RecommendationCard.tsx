import { useState } from "react";
import { Recommendation } from "../../../../types";
import Modal from "../../../components/Modal/Modal";
import PosterCard from "../../../components/PosterCard/PosterCard";
import QuoteMark from "../../../icons/QuoteMark";
import RecommendationComments from "./RecommendationComments";
import useDeleteRecommendation from "../hooks/useDeleteRecommendation";
import useAppStore from "../../../store";
import DeleteIcon from "../../../icons/DeleteIcon";

type Props = {
  recommendation: Recommendation;
};

const RecommendationCard = ({ recommendation }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate: deleteRecommendation } = useDeleteRecommendation();
  const userId = useAppStore().loggedUser?.userId;

  const handleDelete = () => {
    const ok = window.confirm("Delete recommendation?");
    if (ok) {
      deleteRecommendation(recommendation.id.toString());
    }
  };

  return (
    <div className="recommendationCard">
      <Modal
        title="Comments"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <RecommendationComments recommendationId={recommendation.id} />
      </Modal>
      <div className="recommendationCard__top">
        <div className="recommendationCard__left">
          {recommendation.description && (
            <>
              <QuoteMark classname="recommendationCard__quoteMark" />
              <p>{recommendation.description}</p>
            </>
          )}
          <p className="recommendationCard__left__username">
            - {recommendation.username}
          </p>
        </div>
        <PosterCard size="sm" movie={recommendation.movie} />
      </div>
      <div className="recommendationCard__buttons">
        <p onClick={() => setModalOpen(true)}>
          <i>🗨</i> {recommendation.commentCount}
        </p>
        {userId === recommendation.userId && (
          <DeleteIcon
            className="recommendationCard__buttons__deleteIcon"
            onClick={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
