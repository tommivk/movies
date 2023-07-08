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
  credits?: { cast: Cast[] };
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  runtime: number;
};

export type Cast = {
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string;
  castId: number;
  character: string;
  creditId: string;
  order: number;
  job?: string;
};

export type SearchResult = {
  page: number;
  totalPages: number;
  totalResults: number;
  results: Movie[];
};
