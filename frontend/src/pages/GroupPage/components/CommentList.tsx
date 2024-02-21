import moment from "moment";
import { useRef, useEffect } from "react";
import { RecommendationComment } from "../../../../types";
import useDeleteRecommendationComment from "../hooks/useDeleteRecommendationComment";
import DeleteIcon from "../../../icons/DeleteIcon";
import useAppStore from "../../../store";

type Props = {
  comments: RecommendationComment[];
  recommendationId: number;
};

const CommentList = ({ comments, recommendationId }: Props) => {
  const loggedUserId = useAppStore().loggedUser?.userId;
  const { mutate: deleteComment } = useDeleteRecommendationComment();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView();
    }
  }, [comments]);

  const handleCommentDelete = (commentId: number) => {
    const ok = window.confirm("Delete comment?");
    if (ok) {
      deleteComment({
        recommendationId: recommendationId.toString(),
        commentId: commentId.toString(),
      });
    }
  };

  return (
    <div className="commentList">
      {comments.map(({ id, comment, username, timestamp, userId }) => (
        <div className="commentList__comment" key={id}>
          <img />
          <div className="commentList__middle">
            <p className="commentList__username">{username} </p>
            <p className="commentList__message">{comment}</p>
          </div>

          <div className="commentList__right">
            <p className="commentList__time">{moment(timestamp).fromNow()}</p>
            {loggedUserId === userId && (
              <DeleteIcon
                className="commentList__comment__deleteIcon"
                onClick={() => handleCommentDelete(id)}
              />
            )}
          </div>
        </div>
      ))}
      {comments.length === 0 && <p>No comments yet...</p>}
      <div ref={endRef} />
    </div>
  );
};

export default CommentList;
