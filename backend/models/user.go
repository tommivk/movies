package models

import (
	"errors"
	"fmt"
	"movies/custom_errors"
	"movies/enums"
	"movies/forms"
	"movies/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type User struct {
	Id           int
	Username     string
	PasswordHash string `db:"password_hash"`
}

type LoginResponse struct {
	UserId   int    `json:"userId"`
	Token    string `json:"token"`
	Username string `json:"username"`
}

func sendNotification(tx *sqlx.Tx, userId, firedBy int, notificationType enums.NotificationType) {
	sql := "INSERT INTO Notifications (user_id, fired_by_user_id, notification_type) VALUES ($1, $2, $3)"
	tx.Exec(sql, userId, firedBy, notificationType.ToString())
}

func (u User) Login(c *gin.Context, credentials forms.Credentials) (*LoginResponse, error) {
	SECRET := c.MustGet("SECRET").(string)

	user := User{}
	err := db.Get(&user, "SELECT * FROM Users WHERE username=$1", credentials.Username)
	if err != nil {
		return nil, custom_errors.ErrInvalidCredentials
	}

	err = utils.ValidatePassword(user.PasswordHash, credentials.Password)
	if err != nil {
		return nil, custom_errors.ErrInvalidCredentials
	}

	token, err := utils.TokenForUser(user.Id, user.Username, SECRET)
	if err != nil {
		fmt.Println("critical token error: ", err)
		return nil, errors.New("Internal server error")
	}

	res := LoginResponse{Token: token, Username: user.Username, UserId: user.Id}
	return &res, nil
}

func (u User) Create(c *gin.Context, username, passwordHash string) error {
	tx := db.MustBegin()
	sql := `INSERT INTO Users(username, password_hash)
			VALUES($1, $2) RETURNING id`
	var userId int
	tx.QueryRow(sql, username, passwordHash).Scan(&userId)

	sql = "INSERT INTO Notifications (user_id, notification_type) VALUES ($1, $2)"
	tx.Exec(sql, userId, enums.Welcome.ToString())

	return tx.Commit()
}

func (u User) UserExists(c *gin.Context, username string) (bool, error) {
	var userExists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Users WHERE LOWER(username)=$1)`
	err := db.QueryRow(sql, strings.ToLower(username)).Scan(&userExists)
	if err != nil {
		return false, err
	}
	return userExists, nil
}

func (u User) GetAllUsers(c *gin.Context) (*[]UserData, error) {
	sql := `SELECT id, username FROM Users`
	var result []UserData
	err := db.Select(&result, sql)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (u User) GetUserByUsername(c *gin.Context, username string) (*UserData, error) {
	sql := `SELECT id, username FROM Users WHERE username=$1`
	var user UserData
	err := db.Get(&user, sql, username)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (u User) CreateFriendRequest(c *gin.Context, userId, addresseeId int) error {
	if userId == addresseeId {
		return errors.New("You cannot friend yourself")
	}

	exists := friendshipOrRequestExists(db, userId, addresseeId)
	if exists {
		return errors.New("Friendship or friend request already exists")
	}

	idOne := userId
	idTwo := addresseeId
	status := "pending_user_two"

	if addresseeId < userId {
		idOne = addresseeId
		idTwo = userId
		status = "pending_user_one"
	}

	tx := db.MustBegin()
	sql := `INSERT INTO Friends (user_one, user_two, status) VALUES($1, $2, $3)`
	tx.Exec(sql, idOne, idTwo, status)

	sendNotification(tx, addresseeId, userId, enums.FriendRequest)

	return tx.Commit()
}

func (u User) AcceptFriendRequest(c *gin.Context, userId, requesterId int) error {
	exists := friendshipOrRequestExists(db, userId, requesterId)
	if !exists {
		return errors.New("Friend request does not exist")
	}

	tx := db.MustBegin()
	sql := `UPDATE Friends SET status='friends'
			WHERE (user_one=$1 AND user_two=$2 AND status='pending_user_one')
			OR (user_two=$1 AND user_one=$2 AND status='pending_user_two')`
	tx.Exec(sql, userId, requesterId)

	sendNotification(tx, requesterId, userId, enums.AcceptFriendRequest)

	return tx.Commit()
}

func (u User) DenyFriendRequest(c *gin.Context, userId, requesterId int) error {
	tx := db.MustBegin()
	sql := `DELETE FROM Friends WHERE (user_one=$1 AND user_two=$2) OR (user_one=$2 AND user_two=$1)`
	tx.Exec(sql, userId, requesterId)
	sendNotification(tx, requesterId, userId, enums.DeniedFriendRequest)
	return tx.Commit()
}

func friendshipOrRequestExists(db *sqlx.DB, userId, friendId int) bool {
	var exists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Friends WHERE user_one=$1 AND user_two=$2)`
	idOne := userId
	idTwo := friendId
	if friendId < userId {
		idOne = friendId
		idTwo = userId
	}
	err := db.QueryRow(sql, idOne, idTwo).Scan(&exists)
	if err != nil || exists {
		return true
	}
	return false
}

type FriendshipRow struct {
	Id              int
	Status          string
	UserOneId       int    `db:"user_one_id"`
	UserTwoId       int    `db:"user_two_id"`
	UserOneUsername string `db:"user_one_username"`
	UserTwoUsername string `db:"user_two_username"`
}

type UserData struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
}

type Friendships struct {
	Friends          []UserData
	SentRequests     []UserData
	ReceivedRequests []UserData
}

func (u User) GetAllFriendshipsByUserId(c *gin.Context, userId int) (*Friendships, error) {
	sql := `SELECT F.id, F.status, U1.id as user_one_id, U1.username as user_one_username, U2.id as user_two_id, U2.username as user_two_username
			FROM Friends F
			JOIN Users U1 ON U1.id=F.user_one
			JOIN Users U2 ON U2.id=F.user_two
			WHERE F.user_one=$1 OR F.user_two=$1`
	rows, err := db.Queryx(sql, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	friendships := Friendships{
		Friends:          []UserData{},
		SentRequests:     []UserData{},
		ReceivedRequests: []UserData{},
	}

	for rows.Next() {
		var row FriendshipRow
		rows.StructScan(&row)

		switch row.Status {
		case "friends":
			if row.UserOneId == userId {
				friendships.Friends = append(friendships.Friends, UserData{Id: row.UserTwoId, Username: row.UserTwoUsername})
				break
			}
			friendships.Friends = append(friendships.Friends, UserData{Id: row.UserOneId, Username: row.UserOneUsername})

		case "pending_user_one":
			if row.UserOneId == userId {
				friendships.ReceivedRequests = append(friendships.ReceivedRequests, UserData{Id: row.UserTwoId, Username: row.UserTwoUsername})
				break
			}
			friendships.SentRequests = append(friendships.SentRequests, UserData{Id: row.UserOneId, Username: row.UserOneUsername})

		case "pending_user_two":
			if row.UserTwoId == userId {
				friendships.ReceivedRequests = append(friendships.ReceivedRequests, UserData{Id: row.UserOneId, Username: row.UserOneUsername})
				break
			}
			friendships.SentRequests = append(friendships.SentRequests, UserData{Id: row.UserTwoId, Username: row.UserTwoUsername})
		}
	}

	return &friendships, nil
}

func (u User) DeleteFriendship(c *gin.Context, userId, friendId int) error {
	exists := friendshipOrRequestExists(db, userId, friendId)
	if !exists {
		return errors.New("Friendship does not exist")
	}
	sql := `DELETE FROM Friends WHERE (user_one=$1 AND user_two=$2) OR (user_one=$2 AND user_two=$1)`
	_, err := db.Exec(sql, userId, friendId)
	return err
}
