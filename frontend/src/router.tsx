import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ActorPage from "./components/ActorPage/ActorPage";
import Favourites from "./components/Favourites/Favourites";
import HomePage from "./components/HomePage/HomePage";
import Layout from "./components/Layout/Layout";
import MoviePage from "./components/MoviePage/MoviePage";
import MovieSearch from "./components/MovieSearch/MovieSearch";
import ProtectedRoute from "./components/ProtectedRoute";
import GroupSearch from "./components/GroupSearch/GroupSearch";
import GroupPage from "./components/GroupPage/GroupPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<MovieSearch />} />
      <Route path="/actors/:id" element={<ActorPage />} />
      <Route path="/movies/:id" element={<MoviePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/groups" element={<GroupSearch />} />
        <Route path="/groups/:id" element={<GroupPage />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/me" element={<ProfilePage />} />
      </Route>
    </Route>
  )
);
