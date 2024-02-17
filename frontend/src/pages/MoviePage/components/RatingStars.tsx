import { useState } from "react";
import classNames from "classnames";

import "./ratingStars.scss";

type Props = {
  selected?: number;
  onChange: (arg: number) => void;
};

const RatingStars = ({ selected, onChange }: Props) => {
  const [hover, setHover] = useState(selected ? selected - 1 : undefined);

  return (
    <div className="ratingStars">
      <div
        className={classNames("ratingStars__stars", {
          active: hover !== undefined,
        })}
      >
        {[...Array(10)].map((_, index) => (
          <div
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(undefined)}
            onClick={() => onChange(index + 1)}
            key={index}
          >
            <span
              className={classNames("ratingStars__star", {
                on: selected && index <= selected - 1,
                hovered: hover !== undefined && index <= hover,
              })}
            >
              ⭐
            </span>
          </div>
        ))}
      </div>
      <h2>{hover === undefined ? selected ?? 0 : hover + 1} / 10</h2>
    </div>
  );
};

export default RatingStars;
