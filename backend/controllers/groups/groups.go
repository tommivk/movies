package groups

import (
	"fmt"
	"log"
	"movies/aws"
	"movies/forms"
	"movies/models"
	"movies/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

var groupModel = new(models.Group)
var recommendationsModel = new(models.Recommendation)
var moviesModel = new(models.Movie)

func CreateGroup(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	var body forms.NewGroup
	err := c.BindWith(&body, binding.FormMultipart)
	if err != nil {
		c.Error(err)
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Missing image")
		return
	}

	imageUrl, err := aws.UploadImage("groups", file)

	if err != nil {
		log.Println(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, "Failed to upload file")
		return
	}

	passwordHash := ""

	if body.Private {
		if len(body.Password) < 5 {
			c.AbortWithStatusJSON(http.StatusBadRequest, "Password must be at least 5 characters long")
			return
		}
		passwordHash, err = utils.HashPassword(body.Password)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, "Failed to hash password")
			return
		}
	}

	group, err := groupModel.CreateNewGroup(c, userId, body.Name, body.Private, passwordHash, imageUrl)
	if err != nil {
		fmt.Println(err)
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, group)
}

func GetGroups(c *gin.Context) {
	search := c.Query("search")
	groups, err := groupModel.GetGroups(c, search)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, groups)
}

func GetGroupById(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	groupId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid groupId param")
		return
	}
	group, err := groupModel.GetGroupById(c, groupId)
	if err != nil {
		c.Error(err)
		return
	}

	if group.Private {
		userInGroup, err := groupModel.IsUserInGroup(c, userId, groupId)
		if err != nil {
			c.Error(err)
			return
		}
		if !userInGroup {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "You must be in the group to view the groups data")
			return
		}
	}

	c.JSON(http.StatusOK, group)
}

func JoinGroup(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	groupId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid groupId param")
		return
	}

	group, err := groupModel.GetGroupById(c, groupId)
	if err != nil {
		c.Error(err)
		return
	}

	exists, err := groupModel.IsUserInGroup(c, userId, groupId)
	if err != nil {
		c.Error(err)
		return
	}
	if exists {
		c.AbortWithStatusJSON(http.StatusConflict, "You have already joined this group")
		return
	}

	if group.Private {
		var body forms.JoinGroup
		err = c.BindJSON(&body)
		if err != nil {
			c.Error(err)
			return
		}

		passwordHash, err := group.GetGroupPasswordHashById(c, groupId)
		if err != nil {
			c.Error(err)
			return
		}

		err = utils.ValidatePassword(*passwordHash, body.Password)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, "Incorrect password")
			return
		}
	}

	err = groupModel.AddUserToGroup(c, userId, groupId)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, "Successfully joined group")
}

func LeaveGroup(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	groupId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid groupId param")
		return
	}

	userInGroup, err := groupModel.IsUserInGroup(c, userId, groupId)
	if err != nil {
		c.Error(err)
		return
	}
	if !userInGroup {
		c.AbortWithStatusJSON(http.StatusBadRequest, "You are not in this group")
		return
	}

	err = groupModel.RemoveUserFromGroup(c, userId, groupId)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, "")
}

func RecommendMovie(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	var body forms.MovieRecommendation
	err := c.BindJSON(&body)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid request body")
		return
	}

	err = recommendationsModel.AddRecommendation(c, userId, body.MovieId, body.GroupId, body.Description)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, "Recommendation successfully added")
}

type RecommendationsResponse struct {
	models.RecommendationResult
	Movie models.Movie `json:"movie"`
}

func addMovieDataToRecommendations(c *gin.Context, recommendations []models.RecommendationResult) (*[]RecommendationsResponse, error) {
	result := []RecommendationsResponse{}

	for i := 0; i < len(recommendations); i++ {
		res := RecommendationsResponse{RecommendationResult: recommendations[i], Movie: models.Movie{}}
		movieData, err := moviesModel.FetchMovieById(c, strconv.Itoa(recommendations[i].MovieId))
		if err != nil {
			return nil, err
		}
		res.Movie = movieData
		res.MovieId = 0
		result = append(result, res)
	}

	return &result, nil
}

func GetRecommendations(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	groupId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, "Invalid param: 'id'")
		return
	}

	isPrivateGroup, err := groupModel.IsPrivateGroup(c, groupId)
	if err != nil {
		c.Error(err)
		return
	}
	if isPrivateGroup {
		userInGroup, err := groupModel.IsUserInGroup(c, userId, groupId)
		if err != nil {
			c.Error(err)
			return
		}
		if !userInGroup {
			c.AbortWithStatusJSON(http.StatusBadRequest, "You are not in this group")
			return
		}
	}

	result, err := recommendationsModel.GetRecommendationsByGroupId(c, groupId)
	if err != nil {
		c.Error(err)
		return
	}

	response, err := addMovieDataToRecommendations(c, *result)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, response)
}

func GetGroupsMembers(c *gin.Context) {
	groupId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, "Invalid param: 'id'")
		return
	}
	users, err := groupModel.GetUsersInGroup(c, groupId)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, users)
}
