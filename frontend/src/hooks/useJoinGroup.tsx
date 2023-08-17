import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "../../utils";

const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["joinGroup"],
    mutationFn: ({
      groupId,
      password,
      token,
    }: {
      groupId: number;
      password?: string;
      token?: string;
    }) =>
      fetchData({
        path: `/groups/${groupId}/join`,
        method: "POST",
        token,
        body: { password },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchUserData"]);
      toast.success("Successfully joined group");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export default useJoinGroup;
