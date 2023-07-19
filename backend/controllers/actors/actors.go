package actors

import (
	"encoding/json"
	"fmt"
	"movies/controllers/movies"
	"movies/utils"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type ActorMovie struct {
	movies.Movie
	Character string `json:"character"`
}

type Credits struct {
	Cast []ActorMovie `json:"cast"`
}

type ActorResponse struct {
	Actor
	MovieCredits Credits `json:"movie_credits"`
}

type Actor struct {
	Id           int      `json:"id"`
	Name         string   `json:"name"`
	AlsoKnownAs  []string `json:"also_known_as"`
	PlaceOfBirth string   `json:"place_of_birth"`
	ProfilePath  string   `json:"profile_path"`
	Biography    string   `json:"biography"`
	Birthday     string   `json:"birthday"`
	Deathday     string   `json:"deathday"`
}

func GetActorById(c *gin.Context) {
	actorId := c.Param("id")
	API_KEY := c.MustGet("API_KEY").(string)

	baseURL, _ := url.Parse(fmt.Sprintf("https://api.themoviedb.org/3/person/%s", actorId))
	params := url.Values{}
	params.Add("api_key", API_KEY)
	params.Add("append_to_response", "movie_credits")
	baseURL.RawQuery = params.Encode()

	res, err := utils.FetchData(baseURL.String())
	if err != nil {
		c.Error(err)
		return
	}

	var response ActorResponse
	err = json.Unmarshal(res, &response)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, response)
}
