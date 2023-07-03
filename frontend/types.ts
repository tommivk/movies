export type Movie = {
  id: number;
  title: string;
  backdropPath: string;
  genres: { id: string; name: string }[];
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
};

export type SearchResult = {
  totalPages: number;
  totalResults: number;
  results: Movie[];
};
