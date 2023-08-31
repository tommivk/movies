package models

import (
	"movies/custom_errors"

	"github.com/gin-gonic/gin"
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
	var favouriteExists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Favourites WHERE user_id=$1 AND movie_id=$2)`
	err := db.QueryRow(sql, userId, movieId).Scan(&favouriteExists)
	if err != nil {
		return false, err
	}
	return favouriteExists, nil
}

func (f *Favourite) AddFavourite(c *gin.Context, userId int, movieId string) error {
	sql := `INSERT INTO FAVOURITES (movie_id, user_id) VALUES($1, $2)`
	_, err := db.Exec(sql, movieId, userId)
	return err
}

func (f *Favourite) RemoveFavourite(c *gin.Context, userId, movieId int) error {
	sql := `DELETE FROM Favourites WHERE movie_id=$1 AND user_id=$2`
	res, err := db.Exec(sql, movieId, userId)
	if err != nil {
		return err
	}
	if count, err := res.RowsAffected(); count == 0 || err != nil {
		return custom_errors.ErrNotFound
	}
	return nil
}
