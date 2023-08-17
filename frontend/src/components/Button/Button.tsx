import classNames from "classnames";

import "./button.scss";

type Props = {
  children: React.ReactNode;
  color?: "primary" | "transparent" | "secondary";
  size?: "sm" | "md" | "lg";
  hoverEffect?: "zoom" | "brighten";
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  color = "primary",
  size = "md",
  hoverEffect = "brighten",
  active = false,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={classNames(`btn ${props.className}`, {
        "--active": active,
        [color]: color,
        [hoverEffect]: hoverEffect,
        [size]: size,
      })}
    >
      {children}
    </button>
  );
};

export default Button;
