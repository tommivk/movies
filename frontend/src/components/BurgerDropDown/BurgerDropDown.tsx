import { Menu } from "@headlessui/react";
import { Link } from "react-router-dom";
import DropDownMenu from "../DropDownMenu/DropDownMenu";

import "./burgerDropDown.scss";

const MenuItem = ({
  icon,
  href,
  text,
}: {
  icon: string;
  href: string;
  text: string;
}) => {
  return (
    <Menu.Item>
      <Link to={href} className="menuItem">
        <span>{icon}</span>
        {text}
      </Link>
    </Menu.Item>
  );
};

const Burger = () => {
  return (
    <div className="burger">
      <div />
      <div />
      <div />
    </div>
  );
};

const BurgerDropDown = ({ handleLogOut }: { handleLogOut: () => void }) => {
  return (
    <DropDownMenu
      className="burgerDropDown"
      menuButton={<Burger />}
      items={
        <>
          <MenuItem href="/search" icon="🔍" text="Search" />
          <MenuItem href="/favourites" icon="⭐" text="Favourites" />
          <MenuItem href="/groups" icon="💬" text="Groups" />

          <button onClick={handleLogOut} className="burgerDropDown__logout">
            <span className="logout__icon">⇤</span>
            Log out
          </button>
        </>
      }
    />
  );
};

export default BurgerDropDown;
