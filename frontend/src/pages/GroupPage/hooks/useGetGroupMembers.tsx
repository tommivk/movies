import { useQuery } from "@tanstack/react-query";
import { User } from "../../../../types";
import { fetchData } from "../../../../utils";
import useAppStore from "../../../store";

const useGetGroupMembers = (groupId: number) => {
  const { token } = useAppStore().loggedUser ?? {};

  return useQuery<User[]>({
    queryKey: ["getGroupMembers", groupId],
    queryFn: () =>
      fetchData({ path: `/groups/${groupId}/members`, method: "GET", token }),
  });
};

export default useGetGroupMembers;
