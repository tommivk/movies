import { create } from "zustand";

type UserData = {
  userId: number | undefined;
  username: string | undefined;
  token: string | undefined;
};

type AppState = {
  loggedUser: UserData | undefined;
  favouritedMovieIds: number[];
  setLoggedUser: (user?: UserData) => void;
  setFavouritedMovieIds: (favouritedMovieIds: number[]) => void;
};

const useAppStore = create<AppState>((set) => ({
  favouritedMovieIds: [],
  loggedUser: undefined,
  setLoggedUser: (loggedUser?: UserData) => set({ loggedUser }),
  setFavouritedMovieIds: (favouritedMovieIds: number[]) =>
    set({ favouritedMovieIds }),
}));

export default useAppStore;
