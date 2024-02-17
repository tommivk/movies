import moment from "moment";
import { useRef, useEffect } from "react";
import { RecommendationComment } from "../../../../types";

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

export default CommentList;
