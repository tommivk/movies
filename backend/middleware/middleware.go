package middleware

import (
	"movies/constants"
	"movies/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
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
			c.AbortWithStatusJSON(http.StatusNotFound, err.Error())
		default:
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
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
		if len(auth) == 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "Missing authorization header")
			return
		}

		tokenStr := strings.Split(auth[0], " ")
		if len(tokenStr) != 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "Invalid authorization header")
			return
		}
		if tokenStr[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "Invalid authorization header")
			return
		}

		token := tokenStr[1]

		claims, err := utils.ParseToken(token, SECRET)
		if err != nil {
			if err.Errors == jwt.ValidationErrorExpired {
				c.AbortWithStatusJSON(http.StatusUnauthorized, "Expired token")
				return
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, "Invalid token")
			return
		}

		username := claims["username"].(string)
		userId := claims["userId"].(float64)
		c.Set("username", username)
		c.Set("userId", int(userId))
		c.Next()
	}
}
