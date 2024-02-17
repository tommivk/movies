import { useQuery } from "@tanstack/react-query";
import { Movie } from "../../../../types";
import { fetchData } from "../../../../utils";

const useFetchMovie = ({ id }: { id?: string }) => {
  return useQuery({
    queryKey: ["fetchMovie", id],
    queryFn: (): Promise<Movie> => fetchData({ path: `/movies/${id}` }),
  });
};

export default useFetchMovie;
