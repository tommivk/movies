package favourites

import (
	"math"
	"movies/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

var favouritesModel = new(models.Favourite)
var moviesModel = new(models.Movie)

func AddFavourite(c *gin.Context) {
	movieId := c.Param("id")
	userId := c.MustGet("userId").(int)

	favouriteExists, err := favouritesModel.FavouriteExists(c, userId, movieId)
	if err != nil {
		c.Error(err)
		return
	}
	if favouriteExists {
		c.AbortWithStatusJSON(http.StatusForbidden, "The Movie is already in your favourites")
		return
	}

	if err := favouritesModel.AddFavourite(c, userId, movieId); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, "Movie successfully favourited")
}

func RemoveFavourite(c *gin.Context) {
	movieId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid param 'id'")
		return
	}
	userId := c.MustGet("userId").(int)
	err = favouritesModel.RemoveFavourite(c, userId, movieId)
	if err != nil {
		c.Error(err)
		return
	}
	c.Status(http.StatusNoContent)
}

func FavouritedMovieIds(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	result, err := favouritesModel.GetFavouriteMovieIdsByUserId(c, userId, "")
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, result)
}

func FavouritedMovies(c *gin.Context) {
	pageStr := c.Query("page")
	show := c.Query("show")
	userId := c.MustGet("userId").(int)
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, "Invalid page query param")
		return
	}

	favourites, err := favouritesModel.GetFavouriteMovieIdsByUserId(c, userId, show)
	if err != nil {
		c.Error(err)
		return
	}
	ids := favourites.MovieIds

	// Fetch 20 movies at a time because of 50req/s ratelimit on API
	moviesOnPage := 20
	totalPages := int(math.Ceil(float64(len(ids)) / float64(moviesOnPage)))

	start := (page - 1) * moviesOnPage
	end := start + moviesOnPage
	if end > len(ids) {
		end = len(ids)
	}

	results := []models.Movie{}

	for i := start; i < end; i++ {
		movieId := strconv.Itoa(ids[i])
		movie, err := moviesModel.FetchMovieById(c, movieId)
		if err != nil {
			c.Error(err)
			return
		}
		results = append(results, movie)
	}
	response := models.SearchResult{
		Page:         page,
		Results:      results,
		TotalPages:   totalPages,
		TotalResults: len(ids),
	}

	c.JSON(http.StatusOK, response)
}
