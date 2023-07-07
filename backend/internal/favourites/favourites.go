package favourites

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

func AddFavourite(c *gin.Context) {
	movieId := c.Param("id")
	db := c.MustGet("db").(*sqlx.DB)
	userId := c.MustGet("userId").(int)

	var favouriteExists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Favourites WHERE user_id=$1 AND movie_id=$2)`
	err := db.QueryRow(sql, userId, movieId).Scan(&favouriteExists)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	if favouriteExists {
		c.AbortWithStatusJSON(http.StatusForbidden, "The Movie is already in your favourites")
		return
	}

	// TODO: check if movie exists

	sql = `INSERT INTO FAVOURITES (movie_id, user_id) VALUES($1, $2)`
	_, err = db.Exec(sql, movieId, userId)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
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
