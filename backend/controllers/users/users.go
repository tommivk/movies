package users

import (
	"movies/forms"
	"movies/models"
	"movies/utils"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

var userModel = new(models.User)
var ratingsModel = new(models.Rating)
var notificationModel = new(models.Notification)
var groupModel = new(models.Group)

func Login(c *gin.Context) {
	var body forms.Credentials
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Missing username or password")
		return
	}

	user, err := userModel.Login(c, body)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func SignUp(c *gin.Context) {
	var body forms.Credentials

	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, "Missing username or password")
		return
	}

	body.Username = strings.TrimSpace(body.Username)

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

	userExists, err := userModel.UserExists(c, body.Username)
	if err != nil {
		c.Error(err)
		return
	}
	if userExists {
		c.AbortWithStatusJSON(http.StatusConflict, "Username is taken")
		return
	}

	err = userModel.Create(c, body.Username, passwordHash)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, "Account successfully created")
}

func RatedMovies(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	ratings, err := ratingsModel.GetRatingsByUserId(c, userId)
	if err != nil {
		c.Error(err)
		return

	}
	c.JSON(http.StatusOK, ratings)
}

func SendFriendRequest(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	var body forms.FriendRequest
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid request body")
		return
	}

	err := userModel.CreateFriendRequest(c, userId, body.AddresseeId)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, "Friendship request sent")
}

func GetFriendships(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	result, err := userModel.GetAllFriendshipsByUserId(c, userId)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, result)
}

func RespondToFriendRequest(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	requesterId, err := strconv.Atoi(c.Param("userId"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid path param")
		return
	}

	action := c.Query("action")
	if action != "accept" && action != "reject" {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid query param `action`")
		return
	}

	if action == "accept" {
		err = userModel.AcceptFriendRequest(c, userId, requesterId)
		if err != nil {
			c.Error(err)
			return
		}
		c.JSON(http.StatusOK, "Friend request successfully accepted")
		return
	}

	err = userModel.DenyFriendRequest(c, userId, requesterId)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, "Friend request successfully rejected")

}

func DeleteFriend(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	addresseeId, err := strconv.Atoi(c.Param("userId"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid path param")
		return
	}
	err = userModel.DeleteFriendship(c, userId, addresseeId)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, "")
}

func GetUsers(c *gin.Context) {
	users, err := userModel.GetAllUsers(c)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetUserByUsername(c *gin.Context) {
	username := c.Param("username")
	user, err := userModel.GetUserByUsername(c, username)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, user)
}

func GetNotifications(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	notifications, err := notificationModel.GetAllNotificationsByUserId(c, userId)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, notifications)
}

func SetNotificationSeen(c *gin.Context) {
	notificationId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, "Invalid notification id")
		return
	}
	err = notificationModel.SetNotificationSeen(c, notificationId)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, "")
}

func GetUsersGroups(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	groups, err := groupModel.GetGroupsByUserId(c, userId)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, groups)
}
