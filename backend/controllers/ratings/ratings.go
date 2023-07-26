package ratings

import (
	"movies/forms"
	"movies/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var ratingsModel = new(models.Rating)

func RateMovie(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	movieId := c.Param("id")
	var body forms.MovieRating
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid request body")
		return
	}
	if body.Rating < 0 || body.Rating > 10 {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid rating")
		return
	}
	err := ratingsModel.RateMovie(c, movieId, userId, body.Rating)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, "Rating added!")
}

func UpdateMovieRating(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	movieId := c.Param("id")
	var body forms.MovieRating
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid request body")
		return
	}
	if body.Rating < 0 || body.Rating > 10 {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid rating")
		return
	}

	err := ratingsModel.UpdateMovieRating(c, movieId, userId, body.Rating)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, "Rating updated")
}
