import Login from "../Login/Login";
import useAppStore from "../../store";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { Menu } from "@headlessui/react";

import "./navigation.scss";

const Navigation = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const store = useAppStore();
  const setLoggedUser = store.setLoggedUser;

  const handleLogOut = () => {
    setLoggedUser(null);
    localStorage.removeItem("loggedUser");
    toast.success("Goodbye");
  };

  return (
    <div className="nav">
      <Login
        login
        modalOpen={loginModalOpen}
        setModalOpen={setLoginModalOpen}
      />
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
              onClick={() => setLoginModalOpen(true)}
            >
              Login
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

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
      <Menu.Button className="menu__button"></Menu.Button>
      <Menu.Items className="menu__items">
        <MenuItem href="/search" icon="🔍" text="Search" />
        <MenuItem href="/favourites" icon="⭐" text="Favourites" />

        <div className="menu__logout">
          <span className="logout__icon">⇤</span>
          <button onClick={handleLogOut}>Log out</button>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default Navigation;
