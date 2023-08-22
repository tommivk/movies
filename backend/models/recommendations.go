package models

import (
	"movies/utils"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type Recommendation struct {
	Id          int    `json:"id"`
	MovieId     int    `json:"movieId,omitempty" db:"movie_id"`
	GroupId     int    `json:"groupId" db:"group_id"`
	UserId      int    `json:"userId" db:"user_id"`
	Description string `json:"description"`
	Timestamp   string `json:"timestamp"`
}

func (r *Recommendation) AddRecommendation(c *gin.Context, userId, movieId, groupId int, description string) error {
	db := c.MustGet("db").(*sqlx.DB)
	sql := `INSERT INTO Recommendations (movie_id, group_id, user_id, description) VALUES ($1, $2, $3, $4)`
	_, err := db.Exec(sql, movieId, groupId, userId, utils.NewNullString(description))
	if err != nil {
		return err
	}
	return nil
}

func (r *Recommendation) GetRecommendationsByGroupId(c *gin.Context, groupId int) (*[]Recommendation, error) {
	db := c.MustGet("db").(*sqlx.DB)
	sql := `SELECT id, movie_id, group_id, user_id, description, timestamp FROM Recommendations WHERE group_id = $1`
	result := []Recommendation{}
	err := db.Select(&result, sql, groupId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
