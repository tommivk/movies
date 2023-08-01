import { useMutation } from "@tanstack/react-query";
import { fetchData } from "../../utils";
import { Credentials } from "../../types";
import { toast } from "react-toastify";

const useSignUp = () => {
  return useMutation({
    mutationFn: (credentials: Credentials) =>
      fetchData({
        path: "/signup",
        method: "POST",
        body: credentials,
      }),
    onError: ({ message }) => toast.error(message),
  });
};

export default useSignUp;
