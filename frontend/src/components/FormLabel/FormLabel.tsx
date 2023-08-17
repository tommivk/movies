import "./formLabel.scss";

const FormLabel = ({ children }: React.PropsWithChildren) => {
  return <label className="formLabel">{children}</label>;
};

export default FormLabel;
