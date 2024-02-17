import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Loading from "../../../components/Loading/Loading";
import SearchInput from "../../../components/SearchInput/SearchInput";
import useCreateRecommendationComment from "../hooks/useCreateRecommendationComment";
import useGetRecommendationComments from "../hooks/useGetRecommendationComments";
import useJoinGroup from "../../../hooks/useJoinGroup";
import useAppStore from "../../../store";
import CommentList from "./CommentList";

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

export default RecommendationComments;
