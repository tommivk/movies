package models

import (
	"errors"
	"fmt"
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

func (u User) Login(c *gin.Context, credentials forms.Credentials) (*LoginResponse, error) {
	SECRET := c.MustGet("SECRET").(string)
	db := c.MustGet("db").(*sqlx.DB)

	user := User{}
	err := db.Get(&user, "SELECT * FROM Users WHERE username=$1", credentials.Username)
	if err != nil {
		return nil, errors.New("Invalid credentials")
	}

	err = utils.ValidatePassword(user.PasswordHash, credentials.Password)
	if err != nil {
		return nil, errors.New("Invalid credentials")
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
	db := c.MustGet("db").(*sqlx.DB)
	sql := `INSERT INTO Users(username, password_hash)
			VALUES($1, $2)`
	_, err := db.Exec(sql, username, passwordHash)

	if err != nil {
		return err
	}
	return nil
}

func (u User) UserExists(c *gin.Context, username string) (bool, error) {
	db := c.MustGet("db").(*sqlx.DB)
	var userExists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Users WHERE LOWER(username)=$1)`
	err := db.QueryRow(sql, strings.ToLower(username)).Scan(&userExists)
	if err != nil {
		return false, err
	}
	return userExists, nil
}

func (u User) GetAllUsers(c *gin.Context) (*[]UserData, error) {
	db := c.MustGet("db").(*sqlx.DB)
	sql := `SELECT id, username FROM Users`
	var result []UserData
	err := db.Select(&result, sql)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (u User) GetUserByUsername(c *gin.Context, username string) (*UserData, error) {
	db := c.MustGet("db").(*sqlx.DB)
	sql := `SELECT id, username FROM Users WHERE username=$1`
	var user UserData
	err := db.Get(&user, sql, username)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (u User) CreateFriendRequest(c *gin.Context, userId, addresseeId int) error {
	db := c.MustGet("db").(*sqlx.DB)

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

	sql := `INSERT INTO Friends (user_one, user_two, status) VALUES($1, $2, $3)`
	_, err := db.Exec(sql, idOne, idTwo, status)
	if err != nil {
		return err
	}
	return nil
}

func (u User) AcceptFriendRequest(c *gin.Context, userId, requesterId int) error {
	db := c.MustGet("db").(*sqlx.DB)
	exists := friendshipOrRequestExists(db, userId, requesterId)
	if !exists {
		return errors.New("Friend request does not exist")
	}
	sql := `UPDATE Friends SET status='friends'
			WHERE (user_one=$1 AND user_two=$2 AND status='pending_user_one')
			OR (user_two=$1 AND user_one=$2 AND status='pending_user_two')`
	_, err := db.Exec(sql, userId, requesterId)
	if err != nil {
		return err
	}
	return nil
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
	db := c.MustGet("db").(*sqlx.DB)
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
	db := c.MustGet("db").(*sqlx.DB)
	exists := friendshipOrRequestExists(db, userId, friendId)
	if !exists {
		return errors.New("Friendship does not exist")
	}
	sql := `DELETE FROM Friends WHERE (user_one=$1 AND user_two=$2) OR (user_one=$2 AND user_two=$1)`
	_, err := db.Exec(sql, userId, friendId)
	if err != nil {
		return err
	}
	return nil
}
