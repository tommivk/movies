import "./button.scss";

type Props = {
  children: React.ReactNode;
  color?: "primary" | "transparent";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  color = "primary",
  size = "md",
  ...props
}: Props) => {
  return (
    <button {...props} className={`button ${size} ${color}`}>
      {children}
    </button>
  );
};

export default Button;
