import { useEffect } from "react";
import useAppStore from "../store";

const useLoggedUser = () => {
  const store = useAppStore();
  const setLoggedUser = store.setLoggedUser;

  useEffect(() => {
    const data = localStorage.getItem("loggedUser");
    if (data) {
      const userData = JSON.parse(data);
      setLoggedUser(userData);
    }
  }, [setLoggedUser]);
};

export default useLoggedUser;
