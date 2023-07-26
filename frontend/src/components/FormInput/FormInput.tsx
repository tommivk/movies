import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import "./formInput.scss";
import classNames from "classnames";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  register: UseFormRegisterReturn;
  error?: boolean;
};

const FormInput = ({ register, error, ...props }: Props) => {
  return (
    <div className={"formInput"}>
      <label>{props.placeholder}</label>
      <input
        className={classNames("formInput__input", { error: error })}
        {...register}
        {...props}
      ></input>
    </div>
  );
};

export default FormInput;
