package main

import (
	"net/http"
	"os"

	"movies/internal/middleware"
	"movies/internal/movies"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

func ping(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func main() {
	API_KEY := os.Getenv("API_KEY")

	router := gin.Default()

	router.Use(cors.Default()) // allows all origins
	router.Use(middleware.ErrorHandler())
	router.Use(middleware.APIKey(API_KEY))

	router.GET("/ping", ping)

	router.GET("/movies/search", movies.SearchMovie)
	router.GET("/movies/:id", movies.GetMovieById)

	router.Run(":8080")
}
