package groups

import (
	"movies/forms"
	"movies/models"
	"movies/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

var groupModel = new(models.Group)

func CreateGroup(c *gin.Context) {
	userId := c.MustGet("userId").(int)
	var body forms.NewGroup
	err := c.BindJSON(&body)
	if err != nil {
		c.Error(err)
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

	group, err := groupModel.CreateNewGroup(c, userId, body.Name, body.Private, passwordHash)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, group)
}

func GetAllPublicGroups(c *gin.Context) {
	groups, err := groupModel.GetAllPublicGroups(c)
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
			c.AbortWithStatusJSON(http.StatusUnauthorized, "Incorrect password")
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
