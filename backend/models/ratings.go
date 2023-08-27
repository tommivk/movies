package models

import (
	"errors"

	"github.com/gin-gonic/gin"
)

type Rating struct {
	Id      int
	MovieId int `db:"movie_id"`
	UserId  int `db:"user_id"`
	Rating  int `db:"rating"`
}

func (r *Rating) RateMovie(c *gin.Context, movieId string, userId, rating int) error {
	var ratingExists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Ratings WHERE user_id=$1 AND movie_id=$2)`
	err := db.QueryRow(sql, userId, movieId).Scan(&ratingExists)
	if err != nil {
		return err
	}
	if ratingExists {
		return errors.New("Rating already exists")
	}

	sql = `INSERT INTO Ratings (movie_id, user_id, rating) VALUES ($1, $2, $3)`
	_, err = db.Exec(sql, movieId, userId, rating)
	if err != nil {
		return err
	}
	return nil
}

func (r *Rating) UpdateMovieRating(c *gin.Context, movieId string, userId, rating int) error {
	var ratingExists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Ratings WHERE user_id=$1 AND movie_id=$2)`
	err := db.QueryRow(sql, userId, movieId).Scan(&ratingExists)
	if err != nil {
		return err
	}
	if !ratingExists {
		return errors.New("Rating does not exist")
	}

	sql = `UPDATE Ratings SET rating=$1 WHERE movie_id=$2 AND user_id=$3`
	_, err = db.Exec(sql, rating, movieId, userId)
	if err != nil {
		return err
	}
	return nil
}

func (r *Rating) GetMoviesAverageRating(c *gin.Context, movieId string) (float32, error) {
	var result float32
	sql := `SELECT COALESCE(AVG(rating), 0) FROM Ratings WHERE movie_id=$1`
	err := db.Get(&result, sql, movieId)
	if err != nil {
		return 0, err
	}
	return result, nil
}

type RatingResult struct {
	MovieId int     `json:"movie_id" db:"movie_id"`
	Rating  float32 `json:"rating" db:"rating"`
}

func (r *Rating) GetRatingsByUserId(c *gin.Context, userId int) ([]RatingResult, error) {
	var result []RatingResult
	sql := `SELECT movie_id, rating FROM Ratings WHERE user_id=$1`
	err := db.Select(&result, sql, userId)
	if err != nil {
		return nil, err
	}
	return result, nil
}
