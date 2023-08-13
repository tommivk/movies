import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../utils";

const useSetNotificationSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["handleSeen"],
    mutationFn: ({
      notificationId,
      token,
    }: {
      notificationId: number;
      token?: string;
    }) =>
      fetchData({
        path: `/users/me/notifications/${notificationId}`,
        method: "PATCH",
        body: { seen: true },
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchUserData"]);
    },
  });
};

export default useSetNotificationSeen;
