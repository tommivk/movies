package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

var API_KEY string

func ping(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

type Genre struct {
	Id   int
	Name string
}

type Movie struct {
	Id            int     `json:"id"`
	Title         string  `json:"title"`
	BackdropPath  string  `json:"backdrop_path"`
	GenreIds      []int   `json:"genre_ids,omitempty"`
	Genres        []Genre `json:"genres"`
	Language      string  `json:"original_language"`
	OriginalTitle string  `json:"original_title"`
	Overview      string  `json:"overview"`
	PosterPath    string  `json:"poster_path"`
	ReleaseDate   string  `json:"release_date"`
}

type SearchResult struct {
	Page         int     `json:"page"`
	Results      []Movie `json:"results"`
	TotalPages   int     `json:"total_pages"`
	TotalResults int     `json:"total_results"`
}

const NotFound string = "Not Found"

func fetchData(url string) ([]byte, error) {
	res, err := http.Get(url)
	if res.StatusCode == 404 {
		return nil, errors.New(NotFound)
	}
	if err != nil {
		return nil, err
	}
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return nil, errors.New("Failed to fetch")
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}

func errorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		err := c.Errors.Last()
		if err == nil {
			return
		}

		switch err.Error() {
		case NotFound:
			c.JSON(http.StatusNotFound, err)
		default:
			c.JSON(500, err)
		}
	}
}

func getMovieById(c *gin.Context) {
	id := c.Param("id")

	baseURL, _ := url.Parse("https://api.themoviedb.org/3/movie/" + id)
	params := url.Values{}
	params.Add("api_key", API_KEY)
	baseURL.RawQuery = params.Encode()

	res, err := fetchData(baseURL.String())
	if err != nil {
		c.Error(err)
		return
	}

	var data Movie
	err = json.Unmarshal(res, &data)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, data)
}

func appendGenresToSearchResult(searchResult SearchResult) {
	movies := searchResult.Results
	for i := 0; i < len(movies); i++ {
		for j := 0; j < len(movies[i].GenreIds); j++ {
			appendGenreToMovie(movies[i].GenreIds[j], &movies[i])
		}
		movies[i].GenreIds = nil
	}
}

var genres = [...]Genre{{Id: 28, Name: "Action"}, {Id: 12, Name: "Adventure"}, {Id: 16, Name: "Animation"}, {Id: 35, Name: "Comedy"}, {Id: 80, Name: "Crime"}, {Id: 99, Name: "Documentary"}, {Id: 18, Name: "Drama"}, {Id: 10751, Name: "Family"}, {Id: 14, Name: "Fantasy"}, {Id: 36, Name: "History"}, {Id: 27, Name: "Horror"}, {Id: 10402, Name: "Music"}, {Id: 9648, Name: "Mystery"}, {Id: 10749, Name: "Romance"}, {Id: 878, Name: "Science Fiction"}, {Id: 10770, Name: "TV Movie"}, {Id: 53, Name: "Thriller"}, {Id: 10752, Name: "War"}, {Id: 37, Name: "Western"}}

//	type GenreResult struct {
//		Genres []Genre
//	}

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

func searchMovie(c *gin.Context) {
	search := c.Query("q")

	baseURL, _ := url.Parse("https://api.themoviedb.org/3/search/movie")
	params := url.Values{}
	params.Add("query", search)
	params.Add("api_key", API_KEY)
	baseURL.RawQuery = params.Encode()

	var searchResult SearchResult
	body, err := fetchData(baseURL.String())
	if err != nil {
		c.Error(err)
		return
	}
	err = json.Unmarshal(body, &searchResult)
	if err != nil {
		c.Error(err)
		return
	}

	appendGenresToSearchResult(searchResult)

	c.JSON(http.StatusOK, searchResult)
}

func main() {
	API_KEY = os.Getenv("API_KEY")
	router := gin.Default()

	router.Use(cors.Default()) // allows all origins
	router.Use(errorHandler())

	router.GET("/ping", ping)
	router.GET("/movies/search", searchMovie)
	router.GET("/movies/:id", getMovieById)

	router.Run(":8080")
}
