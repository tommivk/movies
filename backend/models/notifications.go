package models

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type Notification struct {
	Id               int    `json:"id"`
	Seen             bool   `json:"seen"`
	Timestamp        string `json:"timestamp"`
	FiredBy          int    `json:"firedBy" db:"fired_by"`
	NotificationType string `json:"notificationType" db:"notification_type"`
}

func (*Notification) GetAllNotificationsByUserId(c *gin.Context, userId int) (*[]Notification, error) {
	db := c.MustGet("db").(*sqlx.DB)
	sql := `SELECT id, seen, timestamp, notification_type FROM Notifications
			WHERE user_id = $1
			ORDER BY (seen is false) DESC, timestamp DESC`
	result := []Notification{}
	err := db.Select(&result, sql, userId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (*Notification) SetNotificationSeen(c *gin.Context, notificationId int) error {
	db := c.MustGet("db").(*sqlx.DB)
	sql := `UPDATE Notifications SET seen=true WHERE id=$1`
	_, err := db.Exec(sql, notificationId)
	if err != nil {
		return err
	}
	return nil
}
