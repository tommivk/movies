import "./loading.scss";

type Props = {
  size?: "sm" | "md" | "lg";
};

const Loading = ({ size = "md" }: Props) => {
  return (
    <div className={`loading ${size}`}>
      <div className="loading__ball" />
      <div className="loading__ball delay--100" />
      <div className="loading__ball delay--200" />
    </div>
  );
};

export default Loading;
