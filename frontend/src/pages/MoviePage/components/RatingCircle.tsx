import classNames from "classnames";

import "./ratingCircle.scss";

type Props = {
  rating?: string;
  userRating?: boolean;
};

const RatingCircle = ({ rating, userRating }: Props) => {
  const percentage = (Number(rating) / 10) * 100;
  const good = 75;
  const ok = 60;

  return (
    <svg
      viewBox="0 0 36 36"
      className={classNames("ratingCircle", { userRating: userRating })}
    >
      <path
        className="ratingCircle__bg"
        d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      {rating && (
        <path
          className={classNames(`ratingCircle__rating`, {
            good: percentage >= good,
            ok: percentage >= ok,
          })}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="1"
          strokeDasharray={`${percentage}, 100`}
        />
      )}
      <text x="18" y="20.35" className="ratingCircle__text">
        {!rating && userRating && "Rate"}
        {!rating && !userRating && "N/A"}
        {rating}
      </text>
    </svg>
  );
};

export default RatingCircle;
