import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchData } from "../../../utils";
import useAppStore from "../../store";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import { Group, Recommendation, User } from "../../../types";
import PosterCard from "../PosterCard/PosterCard";
import QuoteMark from "../../icons/QuoteMark";
import Swiper from "../Swiper/Swiper";
import Modal from "../Modal/Modal";
import { useMemo, useState } from "react";
import { SwiperSlide } from "swiper/react";
import Loading from "../Loading/Loading";

import "./groupPage.scss";

const Recommendations = ({ groupId }: { groupId: number }) => {
  const { token } = useAppStore().loggedUser ?? {};
  const {
    data: recommendations,
    isLoading,
    isError,
  } = useQuery<Recommendation[]>({
    queryKey: ["getRecommendations", groupId],
    queryFn: () =>
      fetchData({
        path: `/groups/${groupId}/recommendations`,
        method: "GET",
        token,
      }),
  });

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

  if (isError) {
    return <p>Failed to fetch recommendations</p>;
  }

  return (
    <div className="recommendations">
      <h1>Recently Recommended</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="recommendations__list">
          <Swiper slides={slides} size="md" />
        </div>
      )}
      {recommendations?.length === 0 && <p>No recommendations.</p>}
    </div>
  );
};

const RecommendationCard = ({
  recommendation,
}: {
  recommendation: Recommendation;
}) => {
  return (
    <div className="recommendationCard">
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
  );
};

const MemberList = ({
  groupId,
  isOpen,
  onClose,
}: {
  groupId: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { token } = useAppStore().loggedUser ?? {};
  const {
    data: members,
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["getGroupMembers", groupId],
    queryFn: () =>
      fetchData({ path: `/groups/${groupId}/members`, method: "GET", token }),
  });

  if (isLoading) {
    return <LoadingContainer />;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Group Members (${members.length})`}
    >
      <div className="groupMemberList">
        {members.map((member) => (
          <div key={member.id} className="groupMemberList__member">
            <img />
            <p>{member.username}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

const GroupPage = () => {
  const groupId = Number(useParams().id);
  const [modalOpen, setModalOpen] = useState(false);
  const { token } = useAppStore().loggedUser ?? {};
  const {
    data: group,
    isLoading,
    isError,
  } = useQuery<Group>({
    queryKey: ["getGroup", groupId],
    queryFn: () =>
      fetchData({ path: `/groups/${groupId}`, method: "GET", token }),
  });

  if (isLoading) {
    return <LoadingContainer />;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="groupPage">
      <h1 className="text-center">{group.name}</h1>
      <h2 className="groupPage__memberCount" onClick={() => setModalOpen(true)}>
        <span>{group.memberCount}</span> Members
      </h2>
      <MemberList
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        groupId={groupId}
      />
      <Recommendations groupId={groupId} />
    </div>
  );
};

export default GroupPage;
