package middleware

import (
	"fmt"
	"movies/internal/constants"
	"movies/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		err := c.Errors.Last()
		if err == nil {
			return
		}

		switch err.Error() {
		case constants.NotFound:
			c.JSON(http.StatusNotFound, err)
		default:
			c.JSON(500, err)
		}
	}
}

func APIKey(API_KEY string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("API_KEY", API_KEY)
		c.Next()
	}
}

func DBConn(db *sqlx.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func Secret(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("SECRET", secret)
		c.Next()
	}
}

func VerifyJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		SECRET := c.MustGet("SECRET").(string)

		auth := c.Request.Header["Authorization"]
		fmt.Println(auth)
		if len(auth) == 0 {
			c.AbortWithStatus(401)
			return
		}
		tokenStr := strings.Split(auth[0], " ")
		if len(tokenStr) != 2 {
			c.AbortWithStatus(401)
			return
		}
		if tokenStr[0] != "Bearer" {
			c.AbortWithStatus(401)
			return
		}

		token := tokenStr[1]

		claims, err := utils.ParseToken(token, SECRET)
		if err != nil {
			fmt.Println("ParseToken:", err)
			c.AbortWithStatus(401)
			return
		}

		username := claims["username"].(string)
		c.Set("username", username)
		c.Next()
	}
}
