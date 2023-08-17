import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../utils";
import { Group } from "../../types";

const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createGroup"],
    mutationFn: ({
      body,
      token,
    }: {
      body: Pick<Group, "name" | "private"> & { password?: string };
      token?: string;
    }) => fetchData({ method: "POST", path: "/groups", body, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["getGroups"]);
      queryClient.invalidateQueries(["fetchUserData"]);
    },
  });
};

export default useCreateGroup;
