package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"movies/aws"
	"movies/controllers/actors"
	"movies/controllers/favourites"
	"movies/controllers/groups"
	"movies/controllers/movies"
	"movies/controllers/ratings"
	"movies/controllers/users"
	"movies/middleware"
	"movies/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"
)

func ping(c *gin.Context) {
	c.String(http.StatusOK, "pong")
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

	err := models.InitDB(connStr)
	if err != nil {
		log.Fatal(err)
	}

	if ENV == "test" {
		err = models.AddTestUser()
		if err != nil {
			log.Fatal(err)
		}
	}

	fmt.Println("DB connected")

	err = aws.CreateClient()
	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()
	router.SetTrustedProxies(nil)

	config := cors.DefaultConfig()
	config.AllowHeaders = []string{"Authorization", "Content-Type"}
	config.AllowOrigins = []string{ALLOWED_ORIGIN}

	router.Use(cors.New(config))
	router.Use(middleware.ErrorHandler())
	router.Use(middleware.APIKey(API_KEY))
	router.Use(middleware.Secret(SECRET))

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

	private.GET("/users", users.GetUsers)
	private.GET("/users/:username", users.GetUserByUsername)

	private.GET("/users/me/favourited-movies", favourites.FavouritedMovies)
	private.GET("/users/me/favourited-movie-ids", favourites.FavouritedMovieIds)

	private.GET("/users/me/ratings", users.RatedMovies)

	private.GET("/users/me/notifications", users.GetNotifications)
	private.PATCH("/users/me/notifications/:id", users.SetNotificationSeen)

	private.GET("/users/me/friends", users.GetFriendships)
	private.POST("/users/me/friends", users.SendFriendRequest)
	private.PUT("/users/me/friends/:userId", users.RespondToFriendRequest)
	private.DELETE("/users/me/friends/:userId", users.DeleteFriend)

	private.GET("/users/me/groups", users.GetUsersGroups)

	private.GET("/groups", groups.GetGroups)
	private.GET("/groups/:id", groups.GetGroupById)
	private.GET("/groups/:id/members", groups.GetGroupsMembers)
	private.GET("/groups/:id/recommendations", groups.GetRecommendations)

	private.POST("/groups", groups.CreateGroup)
	private.POST("/groups/recommendations", groups.RecommendMovie)
	private.POST("/groups/:id/join", groups.JoinGroup)

	private.DELETE("/groups/:id/leave", groups.LeaveGroup)

	router.Run(fmt.Sprintf("0.0.0.0:%s", PORT))
}
