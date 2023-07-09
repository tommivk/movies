package favourites

import (
	"movies/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

var favouritesModel = new(models.Favourite)

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
	movieId := c.Param("id")
	db := c.MustGet("db").(*sqlx.DB)
	userId := c.MustGet("userId").(int)

	sql := `DELETE FROM Favourites WHERE movie_id=$1 AND user_id=$2`
	res, err := db.Exec(sql, movieId, userId)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	if count, err := res.RowsAffected(); count == 0 || err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.Status(http.StatusNoContent)
}

func FavouritedMovieIds(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	pathId := c.Param("id")
	id, err := strconv.Atoi(pathId)

	if userId != id || err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, "Unauthorized")
		return
	}

	result, err := favouritesModel.GetFavouriteMovieIdsByUserId(c, userId)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, result)
}
