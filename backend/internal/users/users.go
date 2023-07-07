package users

import (
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
		c.AbortWithStatusJSON(http.StatusUnauthorized, "Missing username or password")
		return
	}

	user := User{}
	err := db.Get(&user, "SELECT * FROM Users WHERE username=$1", body.Username)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, "Invalid credentials")
		return
	}

	err = utils.ValidatePassword(user.PasswordHash, body.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, "Invalid credentials")
		return
	}

	token, err := utils.TokenForUser(user.Username, SECRET)
	if err != nil {
		fmt.Println("critical token error: ", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, "Internal server error")
		return
	}

	res := LoginResponse{Token: token}
	c.JSON(http.StatusOK, res)
}

func SignUp(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
	var body Credentials

	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, "Missing username or password")
		return
	}

	if len(body.Username) < 3 {
		c.AbortWithStatusJSON(http.StatusForbidden, "Username must be at least 3 characters long")
		return
	}
	if len(body.Username) > 19 {
		c.AbortWithStatusJSON(http.StatusForbidden, "Username must be less than 20 characters long")
		return
	}
	if len(body.Password) < 6 {
		c.AbortWithStatusJSON(http.StatusForbidden, "Password must be at least 6 characters long")
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
		c.Error(err)
		return
	}
	if userExists {
		c.AbortWithStatusJSON(http.StatusConflict, "Username is taken")
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
