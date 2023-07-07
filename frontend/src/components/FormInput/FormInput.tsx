import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import "./formInput.scss";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  register: UseFormRegisterReturn;
};

const FormInput = ({ register, ...props }: Props) => {
  return <input className="formInput" {...register} {...props}></input>;
};

export default FormInput;
