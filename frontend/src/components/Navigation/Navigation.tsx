import Login from "../Login/Login";
import useAppStore from "../../store";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import "./navigation.scss";

const Navigation = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const store = useAppStore();
  const setLoggedUser = store.setLoggedUser;
  const { userId } = store.loggedUser ?? {};

  const handleLogOut = () => {
    setLoggedUser(null);
    localStorage.removeItem("loggedUser");
    toast.success("Goodbye");
  };

  console.log(store.loggedUser);

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
        {userId && (
          <li>
            <Link to="/favourites">Favourites</Link>
          </li>
        )}
        <li>
          {store.loggedUser ? (
            <button className="btn btn--transparent" onClick={handleLogOut}>
              Logout
            </button>
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

export default Navigation;
