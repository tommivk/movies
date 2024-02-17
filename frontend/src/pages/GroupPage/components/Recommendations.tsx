import { useMemo } from "react";
import { SwiperSlide } from "swiper/react";
import { Recommendation } from "../../../../types";
import Swiper from "../../../components/Swiper/Swiper";
import RecommendationCard from "./RecommendationCard";

const Recommendations = ({
  recommendations,
}: {
  recommendations: Recommendation[];
}) => {
  const slides =
    useMemo(
      () =>
        recommendations?.map((recommendation) => (
          <SwiperSlide key={recommendation.id}>
            <RecommendationCard recommendation={recommendation} />
          </SwiperSlide>
        )),
      [recommendations]
    ) ?? [];

  return (
    <div className="recommendations">
      <h1>Recently Recommended</h1>
      <div className="recommendations__list">
        <Swiper slides={slides} size="md" />
      </div>
      {recommendations?.length === 0 && <p>No recommendations.</p>}
    </div>
  );
};

export default Recommendations;
