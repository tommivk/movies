import { useQuery } from "@tanstack/react-query";
import { Group } from "../../types";
import { fetchData } from "../../utils";

const useGetAllGroups = (search?: string, token?: string) => {
  return useQuery<Group[]>({
    queryKey: ["getGroups", search, token],
    queryFn: () => fetchData({ path: `/groups?search=${search}`, token }),
  });
};

export default useGetAllGroups;
