package users

import (
	"errors"
	"fmt"
	"movies/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type Credentials struct {
	Username string `binding:"required"`
	Password string `binding:"required"`
}

type User struct {
	Id           int
	Username     string
	PasswordHash string `db:"password_hash"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func Login(c *gin.Context) {
	SECRET := c.MustGet("SECRET").(string)
	db := c.MustGet("db").(*sqlx.DB)

	var body Credentials
	if err := c.BindJSON(&body); err != nil {
		c.Error(errors.New("Missing username or password"))
		return
	}

	user := User{}
	err := db.Get(&user, "SELECT * FROM Users WHERE username=$1", body.Username)
	if err != nil {
		c.AbortWithStatus(401)
		return
	}

	err = utils.ValidatePassword(user.PasswordHash, body.Password)
	if err != nil {
		c.AbortWithStatus(401)
		return
	}

	token, err := utils.TokenForUser(user.Username, SECRET)
	if err != nil {
		fmt.Println("critical token error: ", err)
		c.AbortWithStatus(500)
		return
	}

	res := LoginResponse{Token: token}
	c.JSON(http.StatusOK, res)
}

func AuthTest(c *gin.Context) {
	username := c.MustGet("username").(string)
	fmt.Println(username)
}

func SignUp(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
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
