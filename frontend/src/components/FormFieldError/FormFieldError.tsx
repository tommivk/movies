import "./formFieldError.scss";

const FormFieldError = ({ message }: { message?: string }) => {
  return <p className="formFieldError">{message}</p>;
};

export default FormFieldError;
