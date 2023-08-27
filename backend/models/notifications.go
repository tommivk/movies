package models

import (
	"github.com/gin-gonic/gin"
)

type Notification struct {
	Id               int    `json:"id"`
	Seen             bool   `json:"seen"`
	Timestamp        string `json:"timestamp"`
	FiredByUserId    *int   `json:"firedByUserId" db:"fired_by_user_id"`
	FiredByGroupId   *int   `json:"firedByGroupId" db:"fired_by_group_id"`
	NotificationType string `json:"notificationType" db:"notification_type"`
}

type NotificationResult struct {
	Notification
	FiredByName *string `json:"firedByName" db:"fired_by_name"`
}

func (*Notification) GetAllNotificationsByUserId(c *gin.Context, userId int) (*[]NotificationResult, error) {
	sql := `SELECT id, seen, timestamp, notification_type, fired_by_group_id, fired_by_user_id,
			(CASE 
				WHEN fired_by_group_id IS NOT NULL THEN (SELECT name FROM Groups WHERE id=fired_by_group_id)
				ELSE (SELECT username FROM Users WHERE id=fired_by_user_id)
			END) AS fired_by_name
			FROM Notifications
			WHERE user_id = $1
			ORDER BY (seen is false) DESC, timestamp DESC`
	notifications := []NotificationResult{}
	err := db.Select(&notifications, sql, userId)
	if err != nil {
		return nil, err
	}
	return &notifications, nil
}

func (*Notification) SetNotificationSeen(c *gin.Context, notificationId int) error {
	sql := `UPDATE Notifications SET seen=true WHERE id=$1`
	_, err := db.Exec(sql, notificationId)
	if err != nil {
		return err
	}
	return nil
}
