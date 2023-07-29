import useAppStore from "../../store";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { toast } from "react-toastify";
import { Menu } from "@headlessui/react";
import { ModalContext } from "../../App";

import "./navigation.scss";

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

const DropDown = ({ handleLogOut }: { handleLogOut: () => void }) => {
  return (
    <Menu>
      <Menu.Button className="menuButton">
        <Burger />
      </Menu.Button>
      <Menu.Items className="menu__items">
        <MenuItem href="/search" icon="🔍" text="Search" />
        <MenuItem href="/favourites" icon="⭐" text="Favourites" />

        <button onClick={handleLogOut} className="menu__logout">
          <span className="logout__icon">⇤</span>
          Log out
        </button>
      </Menu.Items>
    </Menu>
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

const Navigation = () => {
  const modalContext = useContext(ModalContext);

  const store = useAppStore();
  const setLoggedUser = store.setLoggedUser;

  const handleLogOut = () => {
    setLoggedUser(null);
    localStorage.removeItem("loggedUser");
    toast.success("Goodbye");
  };

  return (
    <div className="nav">
      <ul>
        <li>
          <Link to="/">
            <h1 className="nav__title">Mövies</h1>
          </Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          {store.loggedUser ? (
            <DropDown handleLogOut={handleLogOut} />
          ) : (
            <button
              className="btn btn--transparent"
              onClick={() =>
                modalContext.setModalState({
                  isOpen: true,
                  isLogin: true,
                })
              }
            >
              Login
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
