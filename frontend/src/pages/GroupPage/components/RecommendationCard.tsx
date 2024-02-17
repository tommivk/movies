import { useState } from "react";
import { Recommendation } from "../../../../types";
import Modal from "../../../components/Modal/Modal";
import PosterCard from "../../../components/PosterCard/PosterCard";
import QuoteMark from "../../../icons/QuoteMark";
import RecommendationComments from "./RecommendationComments";

const RecommendationCard = ({
  recommendation,
}: {
  recommendation: Recommendation;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
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
      </div>
    </div>
  );
};

export default RecommendationCard;
