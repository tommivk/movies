import { useQuery } from "@tanstack/react-query";
import camelcaseKeys from "camelcase-keys";

type Movie = {
  id: number;
  title: string;
  backdropPath: string;
  genreIds: number[];
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
};

type SearchResult = {
  totalPages: number;
  totalResults: number;
  results: Movie[];
};

const fetchData = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return camelcaseKeys(data, { deep: true });
};

const BASE_URL = "http://localhost:8080";

function App() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getMoviebyId"],
    queryFn: (): Promise<SearchResult> =>
      fetchData(`${BASE_URL}/movies/search?q=dog`),
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    console.error({ error });
    if (error instanceof Error) {
      return <p>Error happened: {error.message}</p>;
    }
    return <p>Error</p>;
  }

  console.log(data);

  return <div></div>;
}

export default App;
