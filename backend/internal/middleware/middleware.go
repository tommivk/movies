package middleware

import (
	"database/sql"
	"movies/internal/constants"
	"net/http"

	"github.com/gin-gonic/gin"
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

func DBConn(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}
