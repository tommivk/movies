import { Outlet } from "react-router-dom";
import useAppStore from "../store";

const ProtectedRoute = () => {
  const store = useAppStore();
  const loggedUser = store.loggedUser;

  if (loggedUser === undefined) return <></>;

  if (!loggedUser) {
    return (
      <h1 className="text-center">You must be logged in to view this page</h1>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
