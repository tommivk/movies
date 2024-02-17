import { useQuery } from "@tanstack/react-query";
import { ActorResponse } from "../../../../types";
import { fetchData } from "../../../../utils";

const useFetchActor = ({ id }: { id?: string }) => {
  return useQuery<ActorResponse>({
    queryKey: ["actorData", id],
    queryFn: () => fetchData({ path: `/actors/${id}` }),
  });
};

export default useFetchActor;
