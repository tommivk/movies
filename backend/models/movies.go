package models

import (
	"encoding/json"
	"fmt"
	"movies/utils"
	"net/url"

	"github.com/gin-gonic/gin"
)

type Genre struct {
	Id   int
	Name string
}

type Cast struct {
	Id                 int     `json:"id"`
	KnownForDepartment string  `json:"known_for_department"`
	Name               string  `json:"name"`
	OriginalName       string  `json:"original_name"`
	Popularity         float32 `json:"popularity"`
	ProfilePath        string  `json:"profile_path"`
	CastId             int     `json:"cast_id"`
	Character          string  `json:"character"`
	CreditId           string  `json:"credit_id"`
	Order              int     `json:"order"`
	Job                string  `json:"job,omitempty"`
	Department         string  `json:"department,omitempty"`
}

type Credits struct {
	Cast []Cast `json:"cast,omitempty"`
	Crew []Cast `json:"crew,omitempty"`
}

type Movie struct {
	Id              int          `json:"id"`
	Title           string       `json:"title"`
	BackdropPath    string       `json:"backdrop_path"`
	GenreIds        []int        `json:"genre_ids,omitempty"`
	Genres          []Genre      `json:"genres"`
	Language        string       `json:"original_language"`
	OriginalTitle   string       `json:"original_title"`
	Overview        string       `json:"overview"`
	PosterPath      string       `json:"poster_path"`
	ReleaseDate     string       `json:"release_date"`
	Credits         Credits      `json:"credits,omitempty"`
	VoteAverage     float32      `json:"vote_average,omitempty"`
	VoteCount       int          `json:"vote_count,omitempty"`
	VoteSiteAverage float32      `json:"vote_site_average,omitempty"`
	Popularity      float32      `json:"popularity,omitempty"`
	Runtime         int          `json:"runtime"`
	Recommendations SearchResult `json:"recommendations"`
}

type SearchResult struct {
	Page         int     `json:"page"`
	Results      []Movie `json:"results"`
	TotalPages   int     `json:"total_pages"`
	TotalResults int     `json:"total_results"`
}

var genres = [...]Genre{
	{Id: 28, Name: "Action"},
	{Id: 12, Name: "Adventure"},
	{Id: 16, Name: "Animation"},
	{Id: 35, Name: "Comedy"},
	{Id: 80, Name: "Crime"},
	{Id: 99, Name: "Documentary"},
	{Id: 18, Name: "Drama"},
	{Id: 10751, Name: "Family"},
	{Id: 14, Name: "Fantasy"},
	{Id: 36, Name: "History"},
	{Id: 27, Name: "Horror"},
	{Id: 10402, Name: "Music"},
	{Id: 9648, Name: "Mystery"},
	{Id: 10749, Name: "Romance"},
	{Id: 878, Name: "Science Fiction"},
	{Id: 10770, Name: "TV Movie"},
	{Id: 53, Name: "Thriller"},
	{Id: 10752, Name: "War"},
	{Id: 37, Name: "Western"}}

func appendGenreToMovie(genreId int, movie *Movie) {
	//TODO: cache this API result
	// var genres GenreResult
	// url := fmt.Sprintf("%s?language=en&api_key=%s", "https://api.themoviedb.org/3/genre/movie/list", API_KEY)
	// data, err := fetchData(url)
	// json.Unmarshal(data, &genres)

	idx := -1
	for i := 0; i < len(genres); i++ {
		if genres[i].Id == genreId {
			idx = i
			break
		}
	}
	if idx == -1 {
		fmt.Printf("genreId %d not found", genreId)
		return
	}
	movie.Genres = append(movie.Genres, genres[idx])
}

func appendGenresToSearchResult(searchResult *SearchResult) {
	movies := searchResult.Results
	for i := 0; i < len(movies); i++ {
		for j := 0; j < len(movies[i].GenreIds); j++ {
			appendGenreToMovie(movies[i].GenreIds[j], &movies[i])
		}
		movies[i].GenreIds = nil
	}
}

func (m *Movie) FetchMovieById(c *gin.Context, id string) (Movie, error) {
	API_KEY := c.MustGet("API_KEY").(string)

	baseURL, _ := url.Parse("https://api.themoviedb.org/3/movie/" + id)
	params := url.Values{}
	params.Add("api_key", API_KEY)
	params.Add("append_to_response", "credits,recommendations")
	baseURL.RawQuery = params.Encode()

	res, err := utils.FetchData(baseURL.String())
	if err != nil {
		return Movie{}, err
	}

	var movie Movie
	err = json.Unmarshal(res, &movie)
	if err != nil {
		return Movie{}, err
	}

	appendGenresToSearchResult(&movie.Recommendations)

	return movie, nil
}

func (m *Movie) GetMovies(url *url.URL) (SearchResult, error) {
	var searchResult SearchResult
	body, err := utils.FetchData(url.String())
	if err != nil {
		return SearchResult{}, err
	}
	err = json.Unmarshal(body, &searchResult)
	if err != nil {
		return SearchResult{}, err
	}

	appendGenresToSearchResult(&searchResult)
	return searchResult, nil
}
