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
