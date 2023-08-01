import { useMutation } from "@tanstack/react-query";
import { Credentials } from "../../types";
import { toast } from "react-toastify";
import { fetchData } from "../../utils";
import useAppStore from "../store";

const useLogin = () => {
  const store = useAppStore();

  return useMutation({
    mutationFn: (credentials: Credentials) =>
      fetchData({ path: "/login", method: "POST", body: credentials }),
    onSuccess: async (userData) => {
      store.setLoggedUser(userData);
      localStorage.setItem("loggedUser", JSON.stringify(userData));
      toast.success(`Hello ${userData.username}`);
    },
    onError: ({ message }) => toast.error(message),
  });
};

export default useLogin;
