import { Menu } from "@headlessui/react";

import "./dropDownMenu.scss";

type Props = {
  menuButton: React.ReactNode;
  items: React.ReactNode;
  className?: string;
};

const DropDownMenu = ({ menuButton, items, className }: Props) => {
  return (
    <div className={`dropDownMenu ${className}`}>
      <Menu>
        <Menu.Button className="dropDownMenu__button">{menuButton}</Menu.Button>
        <Menu.Items className="dropDownMenu__items">{items}</Menu.Items>
      </Menu>
    </div>
  );
};

export default DropDownMenu;
