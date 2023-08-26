import { Listbox } from "@headlessui/react";
import { Fragment } from "react";
import classNames from "classnames";

import "./formSelect.scss";

type Props = {
  options: { value: string | number; label: string }[];
  onChange: (event: number | React.ChangeEvent<Element>) => void;
};

const FormSelect = ({ options, onChange }: Props) => {
  const getSelected = (value: (typeof options)[number]["value"]) =>
    options.find((option) => option.value === value)?.label ?? "Select Group";

  return (
    <div className="formSelect">
      <Listbox onChange={(value) => onChange(Number(value))}>
        <Listbox.Button className="formSelect__button">
          {({ value, open }) => (
            <p className={classNames({ open: open })}>{getSelected(value)}</p>
          )}
        </Listbox.Button>
        <Listbox.Options className="formSelect__options">
          {options.map(({ value, label }) => (
            <Listbox.Option key={value} value={value} as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={classNames("formSelect__option", {
                    active: active,
                    selected: selected,
                  })}
                >
                  {label}
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default FormSelect;
