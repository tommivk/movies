import "./container.scss";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Container = ({ children, className }: Props) => {
  return <div className={`container ${className}`}>{children}</div>;
};

export default Container;
