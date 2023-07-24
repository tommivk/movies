import { create } from "zustand";
import { Rating } from "../types";

type UserData = {
  userId: number | undefined;
  username: string | undefined;
  token: string | undefined;
};

type AppState = {
  loggedUser: UserData | undefined | null;
  favouritedMovieIds: number[];
  ratings: Rating[];
  setLoggedUser: (user: UserData | null) => void;
  setFavouritedMovieIds: (favouritedMovieIds: number[]) => void;
  setRatings: (ratings: Rating[]) => void;
};

const useAppStore = create<AppState>((set) => ({
  favouritedMovieIds: [],
  ratings: [],
  loggedUser: undefined,
  setLoggedUser: (loggedUser: UserData | null) => set({ loggedUser }),
  setFavouritedMovieIds: (favouritedMovieIds: number[]) =>
    set({ favouritedMovieIds }),
  setRatings: (ratings: Rating[]) => set({ ratings }),
}));

export default useAppStore;
