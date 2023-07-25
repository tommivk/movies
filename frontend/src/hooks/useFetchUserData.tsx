import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../utils";
import useAppStore from "../store";

const useFetchUserData = () => {
  const store = useAppStore();
  const token = store.loggedUser?.token;

  const fetchUserData = async () => {
    const { movieIds } = await fetchData({
      path: `/users/me/favourited-movie-ids`,
      token,
    });
    const ratings = await fetchData({
      path: `/users/me/ratings`,
      token,
    });
    store.setFavouritedMovieIds(movieIds);
    store.setRatings(ratings);
    return null;
  };

  return useQuery({
    queryKey: ["fetchUserData", token],
    queryFn: fetchUserData,
    enabled: !!store.loggedUser,
  });
};

export default useFetchUserData;
