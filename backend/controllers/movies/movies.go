package movies

import (
	"movies/models"
	"net/http"
	"net/url"
	"strconv"

	"github.com/gin-gonic/gin"
)

var ratingsModel = new(models.Rating)
var moviesModel = new(models.Movie)

func appendSiteAvgToMovie(c *gin.Context, movie *models.Movie) error {
	siteAvg, err := ratingsModel.GetMoviesAverageRating(c, strconv.Itoa(movie.Id))
	if err != nil {
		return err
	}
	movie.VoteSiteAverage = siteAvg
	return nil
}

func GetMovieById(c *gin.Context) {
	id := c.Param("id")

	movie, err := moviesModel.FetchMovieById(c, id)
	if err != nil {
		c.Error(err)
		return
	}
	err = appendSiteAvgToMovie(c, &movie)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, movie)
}

func SearchMovie(c *gin.Context) {
	search := c.Query("q")
	page := c.Query("page")

	API_KEY := c.MustGet("API_KEY").(string)

	baseURL, _ := url.Parse("https://api.themoviedb.org/3/search/movie")
	params := url.Values{}
	params.Add("query", search)
	params.Add("page", page)
	params.Add("api_key", API_KEY)
	baseURL.RawQuery = params.Encode()

	movies, err := moviesModel.GetMovies(baseURL)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, movies)
}

func TrendingMovies(c *gin.Context) {
	page := c.Query("page")

	API_KEY := c.MustGet("API_KEY").(string)

	baseURL, _ := url.Parse("https://api.themoviedb.org/3/trending/movie/week")

	params := url.Values{}
	params.Add("page", page)
	params.Add("api_key", API_KEY)
	baseURL.RawQuery = params.Encode()

	movies, err := moviesModel.GetMovies(baseURL)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, movies)
}

func TopRatedMovies(c *gin.Context) {
	page := c.Query("page")
	API_KEY := c.MustGet("API_KEY").(string)

	baseURL, _ := url.Parse("https://api.themoviedb.org/3/movie/top_rated")
	params := url.Values{}
	params.Add("page", page)
	params.Add("api_key", API_KEY)
	baseURL.RawQuery = params.Encode()

	movies, err := moviesModel.GetMovies(baseURL)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, movies)
}
