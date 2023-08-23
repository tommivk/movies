package models

import (
	"movies/enums"
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

func getGroupMembers(tx *sqlx.Tx, groupId, userId int) []int {
	var userIds []int
	sql := `SELECT U.id FROM UserGroups UG JOIN Users U ON UG.user_id = U.id WHERE UG.group_id=$1 AND UG.user_id != $2`
	tx.Select(&userIds, sql, groupId, userId)
	return userIds
}

func sendNotificationsToGroupMembers(tx *sqlx.Tx, userIds []int, groupId int) {
	sql := `INSERT INTO Notifications (user_id, fired_by, notification_type) VALUES ($1, $2, $3)`
	for _, userId := range userIds {
		tx.Exec(sql, userId, groupId, enums.NewMovieRecommendation.ToString())
	}
}

func (r *Recommendation) AddRecommendation(c *gin.Context, userId, movieId, groupId int, description string) error {
	db := c.MustGet("db").(*sqlx.DB)

	tx := db.MustBegin()
	sql := `INSERT INTO Recommendations (movie_id, group_id, user_id, description) VALUES ($1, $2, $3, $4)`
	tx.Exec(sql, movieId, groupId, userId, utils.NewNullString(description))

	groupMembers := getGroupMembers(tx, groupId, userId)
	sendNotificationsToGroupMembers(tx, groupMembers, groupId)

	err := tx.Commit()
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
