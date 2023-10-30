import { Outlet } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import "./layout.scss";

const Layout = () => {
  return (
    <div className="layout">
      <Navigation />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
