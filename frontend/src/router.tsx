import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ActorPage from "./components/ActorPage/ActorPage";
import Favourites from "./components/Favourites/Favourites";
import HomePage from "./components/HomePage/HomePage";
import Layout from "./components/Layout";
import MoviePage from "./components/MoviePage/MoviePage";
import MovieSearch from "./components/MovieSearch/MovieSearch";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter(
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
