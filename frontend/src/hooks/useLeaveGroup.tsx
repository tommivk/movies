import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "../../utils";

const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["leaveGroup"],
    mutationFn: ({ groupId, token }: { groupId: number; token?: string }) =>
      fetchData({ path: `/groups/${groupId}/leave`, method: "DELETE", token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchUserData"]);
      toast.success("Successfully left the group");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export default useLeaveGroup;
