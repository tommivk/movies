import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import classNames from "classnames";
import FormLabel from "../FormLabel/FormLabel";

import "./formInput.scss";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  register?: UseFormRegisterReturn;
  error?: boolean;
};

const FormInput = ({ register, error, ...props }: Props) => {
  return (
    <div className={"formInput"}>
      <FormLabel>{props.placeholder}</FormLabel>
      <input
        className={classNames("formInput__input", { error: error })}
        {...register}
        {...props}
      ></input>
    </div>
  );
};

export default FormInput;
