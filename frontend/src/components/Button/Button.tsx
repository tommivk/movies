import "./button.scss";

type Props = {
  children: React.ReactNode;
  color?: "primary" | "transparent";
  size?: "sm" | "md" | "lg";
  hoverEffect?: "zoom" | "brighten";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  color = "primary",
  size = "md",
  hoverEffect = "brighten",
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={`btn ${size} ${color} ${hoverEffect} ${props.className}`}
    >
      {children}
    </button>
  );
};

export default Button;
