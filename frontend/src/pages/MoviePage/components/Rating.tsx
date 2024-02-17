import RatingCircle from "./RatingCircle";

const Rating = ({
  rating,
  text,
  userRating,
}: {
  rating?: string;
  text: string;
  userRating?: boolean;
}) => {
  return (
    <div className="rating">
      <RatingCircle rating={rating} userRating={userRating} />
      <p>{text}</p>
    </div>
  );
};

export default Rating;
