package users

import (
	"database/sql"
	"errors"
	"fmt"
	"movies/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Credentials struct {
	Username string `binding:"required"`
	Password string `binding:"required"`
}

func SignUp(c *gin.Context) {
	db := c.MustGet("db").(*sql.DB)
	var body Credentials

	if err := c.BindJSON(&body); err != nil {
		c.Error(errors.New("Missing username or password"))
		return
	}

	if len(body.Username) < 3 {
		c.Error(errors.New("Username must be at least 3 characters long"))
		return
	}
	if len(body.Username) > 19 {
		c.Error(errors.New("Username must be less than 20 characters long"))
		return
	}
	if len(body.Password) < 6 {
		c.Error(errors.New("Password must be at least 6 characters long"))
		return
	}

	passwordHash, err := utils.HashPassword(body.Password)
	if err != nil {
		c.AbortWithStatus(500)
		return
	}

	var userExists bool
	sql := `SELECT EXISTS(SELECT 1 FROM Users WHERE username=$1)`
	err = db.QueryRow(sql, body.Username).Scan(&userExists)
	if err != nil {
		fmt.Println(err)
	}
	if userExists {
		c.Error(errors.New("Username is taken"))
		return
	}

	sql = `INSERT INTO Users(username, password_hash)
			VALUES($1, $2)`
	_, err = db.Exec(sql, body.Username, passwordHash)

	if err != nil {
		c.Error(err)
		return
	}

	c.Status(http.StatusCreated)
}
