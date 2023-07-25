package models

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type Favourite struct {
	Id      int
	MovieId int `db:"movie_id"`
	UserId  int `db:"user_id"`
}

type FavouritedMoviesResponse struct {
	MovieIds []int `json:"movieIds"`
}

func (f *Favourite) GetFavouriteMovieIdsByUserId(c *gin.Context, userId int, filter string) (*FavouritedMoviesResponse, error) {
	db := c.MustGet("db").(*sqlx.DB)

	var sql string

	switch filter {
	case "rated":
		sql = `SELECT F.movie_id FROM Favourites F, Ratings R
		WHERE F.user_id=$1 AND R.user_id = $1
		AND R.movie_id = F.movie_id
		ORDER BY F.id DESC`
	case "unrated":
		sql = `SELECT F.movie_id FROM Favourites F
		LEFT JOIN Ratings R ON R.user_id = F.user_id AND R.movie_id = F.movie_id
		WHERE F.user_id=$1 AND R.user_id IS NULL
		ORDER BY F.id DESC`
	default:
		sql = "SELECT movie_id FROM Favourites WHERE user_id=$1 ORDER BY id DESC"
	}

	var ids []int
	err := db.Select(&ids, sql, userId)
	if err != nil {
		return nil, err
	}
	res := FavouritedMoviesResponse{MovieIds: ids}
	return &res, nil
}

func (f *Favourite) FavouriteExists(c *gin.Context, userId int, movieId string) (bool, error) {
	db := c.MustGet("db").(*sqlx.DB)
	var favouriteExists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Favourites WHERE user_id=$1 AND movie_id=$2)`
	err := db.QueryRow(sql, userId, movieId).Scan(&favouriteExists)
	if err != nil {
		return false, err
	}
	return favouriteExists, nil
}

func (f *Favourite) AddFavourite(c *gin.Context, userId int, movieId string) error {
	db := c.MustGet("db").(*sqlx.DB)
	sql := `INSERT INTO FAVOURITES (movie_id, user_id) VALUES($1, $2)`
	_, err := db.Exec(sql, movieId, userId)
	if err != nil {
		return err
	}
	return nil
}
