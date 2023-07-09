import Layout from "./components/Layout";
import MoviePage from "./components/MoviePage/MoviePage";
import MovieSearch from "./components/MovieSearch/MovieSearch";
import useAppStore from "./store";
import { ToastContainer } from "react-toastify";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { fetchData } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/search" element={<MovieSearch />} />
      <Route path="/movies/:id" element={<MoviePage />} />
    </Route>
  )
);

function App() {
  const store = useAppStore();
  const { userId, token } = store.loggedUser ?? {};
  const setLoggedUser = store.setLoggedUser;

  useEffect(() => {
    const data = localStorage.getItem("loggedUser");
    if (data) {
      const userData = JSON.parse(data);
      setLoggedUser(userData);
    }
  }, [setLoggedUser]);

  const fetchFavouriteMoviesIds = async () => {
    const { movieIds } = await fetchData({
      path: `/users/${userId}/favourited-movie-ids`,
      token,
    });
    store.setFavouritedMovieIds(movieIds);
    return null;
  };

  useQuery({
    queryKey: ["favouriteMovieIds", token],
    queryFn: fetchFavouriteMoviesIds,
    enabled: !!store.loggedUser,
  });

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        theme="dark"
        hideProgressBar={true}
      />
    </>
  );
}

export default App;
