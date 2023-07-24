package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"movies/controllers/actors"
	"movies/controllers/favourites"
	"movies/controllers/movies"
	"movies/controllers/ratings"
	"movies/controllers/users"
	"movies/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"
)

func ping(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

func createTables(db *sqlx.DB) {
	sql, err := ioutil.ReadFile("./tables.sql")
	if err != nil {
		log.Fatal("failed to read ./tables.sql", err)
	}
	_, err = db.Exec(string(sql))
	if err != nil {
		log.Fatal("failed to create tables", err)
	}
}

func main() {
	API_KEY := os.Getenv("API_KEY")
	SECRET := os.Getenv("SECRET")
	DATABASE_URL := os.Getenv("DATABASE_URL")
	ENV := os.Getenv("ENV")
	PORT := os.Getenv("PORT")
	ALLOWED_ORIGIN := os.Getenv("ALLOWED_ORIGIN")

	if PORT == "" {
		PORT = "8080"
	}

	connStr := DATABASE_URL
	if ENV == "test" {
		connStr = "postgres://user:pass@localhost:5432/testDB?sslmode=disable"
	}

	db, err := sqlx.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("DB connected")

	createTables(db)

	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowHeaders = []string{"Authorization", "Content-Type"}
	config.AllowOrigins = []string{ALLOWED_ORIGIN}

	router.Use(cors.New(config))
	router.Use(middleware.ErrorHandler())
	router.Use(middleware.APIKey(API_KEY))
	router.Use(middleware.Secret(SECRET))
	router.Use(middleware.DBConn(db))

	public := router.Group("/")
	public.GET("/ping", ping)

	public.GET("/movies/search", movies.SearchMovie)
	public.GET("/movies/trending", movies.TrendingMovies)
	public.GET("/movies/top-rated", movies.TopRatedMovies)
	public.GET("/movies/:id", movies.GetMovieById)

	public.GET("/actors/:id", actors.GetActorById)

	public.POST("/signup", users.SignUp)
	public.POST("/login", users.Login)

	private := router.Group("/")
	private.Use(middleware.VerifyJWT())

	private.POST("/movies/:id/favourite", favourites.AddFavourite)
	private.DELETE("/movies/:id/favourite", favourites.RemoveFavourite)
	private.POST("/movies/:id/ratings", ratings.RateMovie)
	private.PATCH("/movies/:id/ratings", ratings.UpdateMovieRating)

	private.GET("/users/me/favourited-movies", favourites.FavouritedMovies)
	private.GET("/users/me/favourited-movie-ids", favourites.FavouritedMovieIds)
	private.GET("/users/me/ratings", users.RatedMovies)

	router.Run(fmt.Sprintf("0.0.0.0:%s", PORT))
}
