import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../utils";
import { Notification } from "../../types";

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
    const notifications = (await fetchData({
      path: `/users/me/notifications`,
      token,
    })) as Notification[];
    const groups = await fetchData({
      path: "/users/me/groups",
      token,
    });

    store.setFavouritedMovieIds(movieIds);
    store.setRatings(ratings);
    store.setNotifications(notifications);
    store.setGroups(groups);
    return null;
  };

  return useQuery({
    queryKey: ["fetchUserData", token],
    queryFn: fetchUserData,
    enabled: !!store.loggedUser,
  });
};

export default useFetchUserData;
