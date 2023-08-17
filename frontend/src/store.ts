import { create } from "zustand";
import { Rating, Notification, Group } from "../types";

type UserData = {
  userId: number | undefined;
  username: string | undefined;
  token: string | undefined;
};

type AppState = {
  loggedUser: UserData | undefined | null;
  favouritedMovieIds: number[];
  ratings: Rating[];
  notifications: Notification[];
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  setLoggedUser: (user: UserData | null) => void;
  setFavouritedMovieIds: (favouritedMovieIds: number[]) => void;
  setRatings: (ratings: Rating[]) => void;
  setNotifications: (notifications: Notification[]) => void;
};

const useAppStore = create<AppState>((set) => ({
  favouritedMovieIds: [],
  ratings: [],
  groups: [],
  loggedUser: undefined,
  notifications: [],
  setLoggedUser: (loggedUser: UserData | null) => set({ loggedUser }),
  setFavouritedMovieIds: (favouritedMovieIds: number[]) =>
    set({ favouritedMovieIds }),
  setRatings: (ratings: Rating[]) => set({ ratings }),
  setNotifications: (notifications: Notification[]) => set({ notifications }),
  setGroups: (groups: Group[]) => set({ groups }),
}));

export default useAppStore;
