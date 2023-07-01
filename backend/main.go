package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

var API_KEY string

func ping(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

type Movie struct {
	Id            int
	Title         string
	BackdropPath  string `json:"backdrop_path"`
	GenreIds      []int  `json:"genre_ids,omitempty"`
	Language      string `json:"original_language"`
	OriginalTitle string `json:"original_title"`
	Overview      string
	PosterPath    string `json:"poster_path"`
	ReleaseDate   string `json:"release_date"`
}

type SearchResult struct {
	Page         int
	Results      []Movie
	TotalPages   int `json:"total_pages"`
	TotalResults int `json:"total_results"`
}

func fetchData(url string) ([]byte, error) {
	res, err := http.Get(url)
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

func getMovieById(c *gin.Context) {
	id := c.Param("id")

	baseURL, _ := url.Parse("https://api.themoviedb.org/3/movie/" + id)
	params := url.Values{}
	params.Add("api_key", API_KEY)
	baseURL.RawQuery = params.Encode()

	res, err := fetchData(baseURL.String())
	if len(res) == 0 {
		c.AbortWithStatus(404)
		return
	}
	if err != nil {
		c.AbortWithStatus(500)
		return
	}
	var data Movie
	err = json.Unmarshal(res, &data)
	if err != nil {
		c.AbortWithStatus(500)
		return
	}
	c.JSON(http.StatusOK, data)
}

func searchMovie(c *gin.Context) {
	search := c.Query("q")

	baseURL, _ := url.Parse("https://api.themoviedb.org/3/search/movie")
	params := url.Values{}
	params.Add("query", search)
	params.Add("api_key", API_KEY)
	baseURL.RawQuery = params.Encode()

	var result SearchResult
	body, err := fetchData(baseURL.String())
	if err != nil {
		c.AbortWithStatus(500)
		return
	}
	err = json.Unmarshal(body, &result)
	if err != nil {
		c.AbortWithStatus(500)
		return
	}

	c.JSON(http.StatusOK, result)
}

func main() {
	API_KEY = os.Getenv("API_KEY")
	router := gin.Default()

	router.GET("/ping", ping)
	router.GET("/movies/search", searchMovie)
	router.GET("/movies/:id", getMovieById)
	router.Run(":8080")
}
