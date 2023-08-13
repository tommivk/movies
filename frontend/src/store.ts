import { create } from "zustand";
import { Rating, Notification } from "../types";

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
  setLoggedUser: (user: UserData | null) => void;
  setFavouritedMovieIds: (favouritedMovieIds: number[]) => void;
  setRatings: (ratings: Rating[]) => void;
  setNotifications: (notifications: Notification[]) => void;
};

const useAppStore = create<AppState>((set) => ({
  favouritedMovieIds: [],
  ratings: [],
  loggedUser: undefined,
  notifications: [],
  setLoggedUser: (loggedUser: UserData | null) => set({ loggedUser }),
  setFavouritedMovieIds: (favouritedMovieIds: number[]) =>
    set({ favouritedMovieIds }),
  setRatings: (ratings: Rating[]) => set({ ratings }),
  setNotifications: (notifications: Notification[]) => set({ notifications }),
}));

export default useAppStore;
