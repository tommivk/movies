import { useQuery } from "@tanstack/react-query";

type Movie = {
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
};

type SearchResult = {
  total_pages: number;
  total_results: number;
  results: Movie[];
};

const fetchData = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
};

const BASE_URL = "http://localhost:8080";

function App() {
  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getMoviebyId"],
    queryFn: (): Promise<Movie> => fetchData(`${BASE_URL}/movies/550`),
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    console.error({ error });
    if (error instanceof Error) {
      return <p>Error happened: {error.message}</p>;
    }
    return <p>Error</p>;
  }

  return (
    <div>
      <p>{movie.title}</p>
      <p>{movie.overview}</p>
    </div>
  );
}

export default App;
