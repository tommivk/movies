import { useQuery } from "@tanstack/react-query";
import { Group } from "../../../../types";
import { fetchData } from "../../../../utils";
import useAppStore from "../../../store";

const useGetGroup = (groupId: number) => {
  const { token } = useAppStore().loggedUser ?? {};

  return useQuery<Group>({
    queryKey: ["getGroup", groupId],
    queryFn: () =>
      fetchData({ path: `/groups/${groupId}`, method: "GET", token }),
  });
};

export default useGetGroup;
