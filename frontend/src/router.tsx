import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ActorPage from "./pages/ActorPage/index";
import Favourites from "./pages/Favourites/index";
import HomePage from "./pages/HomePage/index";
import Layout from "./components/Layout/Layout";
import MoviePage from "./pages/MoviePage/index";
import MovieSearch from "./pages/MovieSearch";
import ProtectedRoute from "./components/ProtectedRoute";
import GroupSearch from "./pages/GroupSearch/index";
import GroupPage from "./pages/GroupPage/index";
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
