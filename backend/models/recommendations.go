package models

import (
	"movies/enums"
	"movies/utils"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type Recommendation struct {
	Id           int     `json:"id"`
	MovieId      int     `json:"movieId,omitempty" db:"movie_id"`
	GroupId      int     `json:"groupId" db:"group_id"`
	UserId       int     `json:"userId" db:"user_id"`
	Description  *string `json:"description"`
	Timestamp    string  `json:"timestamp"`
	CommentCount int     `json:"commentCount" db:"comment_count"`
}

type RecommendationResult struct {
	Recommendation
	Username string `json:"username" db:"username"`
}

func getGroupMembers(tx *sqlx.Tx, groupId, userId int) []int {
	var userIds []int
	sql := `SELECT U.id FROM UserGroups UG JOIN Users U ON UG.user_id = U.id WHERE UG.group_id=$1 AND UG.user_id != $2`
	tx.Select(&userIds, sql, groupId, userId)
	return userIds
}

func sendNotificationsToGroupMembers(tx *sqlx.Tx, userIds []int, groupId int) {
	sql := `INSERT INTO Notifications (user_id, fired_by_group_id, notification_type) VALUES ($1, $2, $3)`
	for _, userId := range userIds {
		tx.Exec(sql, userId, groupId, enums.NewMovieRecommendation.ToString())
	}
}

func (r *Recommendation) AddRecommendation(c *gin.Context, userId, movieId, groupId int, description string) error {
	tx := db.MustBegin()
	sql := `INSERT INTO Recommendations (movie_id, group_id, user_id, description) VALUES ($1, $2, $3, $4)`
	tx.Exec(sql, movieId, groupId, userId, utils.NewNullString(description))

	groupMembers := getGroupMembers(tx, groupId, userId)
	sendNotificationsToGroupMembers(tx, groupMembers, groupId)

	return tx.Commit()
}

func (r *Recommendation) GetRecommendationsByGroupId(c *gin.Context, groupId int) (*[]RecommendationResult, error) {
	sql := `SELECT R.id, movie_id, group_id, user_id, description, timestamp,
			(SELECT username FROM Users U WHERE U.id=user_id) as username,
			(SELECT COUNT(*) FROM RecommendationComments RC WHERE RC.recommendation_id=R.id) as comment_count
			FROM Recommendations R WHERE group_id = $1 ORDER BY timestamp DESC`
	result := []RecommendationResult{}
	err := db.Select(&result, sql, groupId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

type RecommendationComment struct {
	Id               int    `json:"id"`
	RecommendationId int    `json:"recommendationId" db:"recommendation_id"`
	Timestamp        string `json:"timestamp"`
	Comment          string `json:"comment"`
	Username         string `json:"username"`
	UserId           int    `json:"userId" db:"user_id"`
}

func (r *Recommendation) CreateRecommendationComment(c *gin.Context, recommendationId, userId int, comment string) error {
	sql := `INSERT INTO RecommendationComments (recommendation_id, user_id, comment) VALUES ($1, $2, $3)`
	_, err := db.Exec(sql, recommendationId, userId, comment)
	return err
}

func (r *Recommendation) GetRecommendationComments(c *gin.Context, recommendationId int) (*[]RecommendationComment, error) {
	sql := `SELECT RC.id, comment, recommendation_id, user_id, timestamp, U.username
			FROM RecommendationComments RC JOIN Users U ON RC.user_id = U.id WHERE recommendation_id=$1
			ORDER BY timestamp ASC`
	result := []RecommendationComment{}
	err := db.Select(&result, sql, recommendationId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (r *Recommendation) GetRecommendationById(c *gin.Context, id int) (*Recommendation, error) {
	sql := `SELECT id, timestamp, movie_id, group_id, user_id, description
			FROM Recommendations WHERE id=$1`
	var result Recommendation
	err := db.Get(&result, sql, id)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
