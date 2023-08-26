import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAppStore from "../../store";
import useModalContext from "../../context/useModalContext";
import BurgerDropDown from "../BurgerDropDown/BurgerDropDown";
import NotificationDropDown from "../NotificationDropDown/NotificationDropDown";

import "./navigation.scss";

const Navigation = () => {
  const { openLoginModal } = useModalContext();

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

        <div className="nav__links">
          <li>
            <Link to="/search">Search</Link>
          </li>
          {store.loggedUser && (
            <li>
              <Link to="/groups">Groups</Link>
            </li>
          )}
        </div>

        {store.loggedUser ? (
          <div className="nav__buttons">
            <li>
              <NotificationDropDown />
            </li>
            <li>
              <BurgerDropDown handleLogOut={handleLogOut} />
            </li>
          </div>
        ) : (
          <li>
            <button
              className="btn btn--transparent"
              onClick={openLoginModal}
              data-cy="login"
            >
              Login
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
