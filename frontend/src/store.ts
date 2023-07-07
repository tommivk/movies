import { create } from "zustand";

type UserData = {
  username: string | undefined;
  token: string | undefined;
};

type AppState = {
  loggedUser: UserData | undefined;
  setLoggedUser: (user?: UserData) => void;
};

const useAppStore = create<AppState>((set) => ({
  loggedUser: undefined,
  setLoggedUser: (loggedUser?: UserData) => set({ loggedUser }),
}));

export default useAppStore;
