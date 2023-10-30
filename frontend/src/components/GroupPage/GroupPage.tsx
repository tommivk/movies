import { useParams } from "react-router-dom";
import useAppStore from "../../store";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import { Recommendation, RecommendationComment } from "../../../types";
import PosterCard from "../PosterCard/PosterCard";
import QuoteMark from "../../icons/QuoteMark";
import Swiper from "../Swiper/Swiper";
import Modal from "../Modal/Modal";
import { useEffect, useMemo, useRef, useState } from "react";
import { SwiperSlide } from "swiper/react";
import Loading from "../Loading/Loading";
import Container from "../Container/Container";
import SearchInput from "../SearchInput/SearchInput";
import Button from "../Button/Button";
import moment from "moment";
import useJoinGroup from "../../hooks/useJoinGroup";
import useGetRecommendationComments from "../../hooks/useGetRecommendationComments";
import useCreateRecommendationComment from "../../hooks/useCreateRecommendationComment";
import useGetRecommendations from "../../hooks/useGetRecommendations";
import useGetGroupMembers from "../../hooks/useGetGroupMembers";
import useGetGroup from "../../hooks/useGetGroup";

import "./groupPage.scss";

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

const RecommendationComments = ({
  recommendationId,
}: {
  recommendationId: number;
}) => {
  const groupId = Number(useParams().id);
  const userGroups = useAppStore().groups;
  const isUserInGroup = userGroups.some(({ id }) => id === groupId);
  const [input, setInput] = useState("");
  const { token } = useAppStore().loggedUser ?? {};
  const { mutate: joinGroup } = useJoinGroup();
  const { mutate: sendComment } =
    useCreateRecommendationComment(recommendationId);
  const {
    data: comments,
    isLoading,
    isError,
  } = useGetRecommendationComments(recommendationId);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <p>Error...</p>;
  }

  return (
    <div>
      <CommentList comments={comments} />
      {isUserInGroup ? (
        <form
          className="commentForm"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) {
              return;
            }
            sendComment(input, { onSuccess: () => setInput("") });
          }}
        >
          <SearchInput
            placeholder="Write comment..."
            autoComplete="off"
            onChange={({ target }) => setInput(target.value)}
            value={input}
            type="text"
          />
          <Button>Send</Button>
        </form>
      ) : (
        <div className="commentForm__info">
          <p>You must join this group to post comments</p>
          <Button onClick={() => joinGroup({ groupId, token })}>Join</Button>
        </div>
      )}
    </div>
  );
};

const CommentList = ({ comments }: { comments: RecommendationComment[] }) => {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView();
    }
  }, [comments]);

  return (
    <div className="commentList">
      {comments.map(({ id, comment, username, timestamp }) => (
        <div className="commentList__comment" key={id}>
          <img />
          <div className="commentList__right">
            <p className="commentList__username">
              {username}{" "}
              <span className="commentList__time">
                {moment(timestamp).fromNow()}
              </span>
            </p>
            <p className="commentList__message">{comment}</p>
          </div>
          <div ref={endRef} />
        </div>
      ))}
      {comments.length === 0 && <p>No comments yet...</p>}
    </div>
  );
};

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

const MemberList = ({
  groupId,
  isOpen,
  onClose,
}: {
  groupId: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: members, isLoading, isError } = useGetGroupMembers(groupId);

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Group Members (${members?.length})`}
    >
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <div className="groupMemberList">
          {members.map((member) => (
            <div key={member.id} className="groupMemberList__member">
              <img />
              <p>{member.username}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

const GroupPage = () => {
  const groupId = Number(useParams().id);
  const [modalOpen, setModalOpen] = useState(false);
  const {
    data: group,
    isLoading: groupLoading,
    isError: groupError,
  } = useGetGroup(groupId);
  const {
    data: recommendations = [],
    isLoading: recommendationsLoading,
    isError: recommendationError,
  } = useGetRecommendations(groupId);

  if (groupLoading || recommendationsLoading) {
    return <LoadingContainer />;
  }
  if (groupError || recommendationError) {
    return <div>Error happened...</div>;
  }

  return (
    <Container className="groupPage">
      <h1 className="text-center">{group.name}</h1>
      <h2 className="groupPage__memberCount" onClick={() => setModalOpen(true)}>
        <span>{group.memberCount}</span> Members
      </h2>
      <MemberList
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        groupId={groupId}
      />
      <Recommendations recommendations={recommendations} />
    </Container>
  );
};

export default GroupPage;
