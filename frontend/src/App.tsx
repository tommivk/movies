import Layout from "./components/Layout";
import MoviePage from "./components/MoviePage/MoviePage";
import MovieSearch from "./components/MovieSearch/MovieSearch";
import Favourites from "./components/Favourites/Favourites";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage/HomePage";
import ActorPage from "./components/ActorPage/ActorPage";
import useAppStore from "./store";
import Login from "./components/LoginModal/LoginModal";
import { ToastContainer } from "react-toastify";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { fetchData } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/search" element={<MovieSearch />} />
      <Route path="/actors/:id" element={<ActorPage />} />
      <Route path="/movies/:id" element={<MoviePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/favourites" element={<Favourites />} />
      </Route>
    </Route>
  )
);

type LoginModalContext = {
  setModalState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      isLogin: boolean;
    }>
  >;
};

export const ModalContext = createContext<LoginModalContext>({
  setModalState: () => undefined,
});

function App() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    isLogin: false,
  });

  const store = useAppStore();
  const token = store.loggedUser?.token;
  const setLoggedUser = store.setLoggedUser;

  useEffect(() => {
    const data = localStorage.getItem("loggedUser");
    if (data) {
      const userData = JSON.parse(data);
      setLoggedUser(userData);
    }
  }, [setLoggedUser]);

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

  useQuery({
    queryKey: ["fetchUserData", token],
    queryFn: fetchUserData,
    enabled: !!store.loggedUser,
  });

  return (
    <>
      <Login
        modalOpen={modalState.isOpen}
        login={modalState.isLogin}
        setModalOpen={(value) =>
          setModalState({ ...modalState, isOpen: Boolean(value) })
        }
      />
      <ModalContext.Provider value={{ setModalState }}>
        <RouterProvider router={router} />
      </ModalContext.Provider>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        hideProgressBar={true}
      />
    </>
  );
}

export default App;
