import Layout from "./components/Layout";
import MoviePage from "./components/MoviePage/MoviePage";
import MovieSearch from "./components/MovieSearch/MovieSearch";
import { ToastContainer } from "react-toastify";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

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
