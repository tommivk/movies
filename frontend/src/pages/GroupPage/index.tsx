import { useParams } from "react-router-dom";
import { useState } from "react";
import useGetRecommendations from "./hooks/useGetRecommendations";
import useGetGroup from "./hooks/useGetGroup";
import Recommendations from "./components/Recommendations";
import MemberList from "./components/MemberList";
import Container from "../../components/Container/Container";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";

import "./index.scss";

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
