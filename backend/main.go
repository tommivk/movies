package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"movies/internal/middleware"
	"movies/internal/movies"
	"movies/internal/users"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"
)

func ping(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func createTables(db *sql.DB) {
	sql, err := ioutil.ReadFile("./tables.sql")
	if err != nil {
		log.Fatal("failed to read ./tables.sql")
	}
	res, err := db.Exec(string(sql))
	if err != nil {
		log.Fatal("failed to create tables", err)
	}
	fmt.Println(res.LastInsertId())
	rows, _ := db.Query("SELECT * FROM Users")
	fmt.Println(rows)
}

func main() {
	API_KEY := os.Getenv("API_KEY")

	connStr := "postgres://postgres:secret@localhost:5500/testDB?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("DB connected")

	createTables(db)

	router := gin.Default()

	router.Use(cors.Default()) // allows all origins
	router.Use(middleware.ErrorHandler())
	router.Use(middleware.APIKey(API_KEY))
	router.Use(middleware.DBConn(db))

	router.GET("/ping", ping)

	router.GET("/movies/search", movies.SearchMovie)
	router.GET("/movies/:id", movies.GetMovieById)

	router.POST("/users/signup", users.SignUp)

	router.Run(":8080")
}
