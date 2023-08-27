package models

import (
	"movies/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

type Group struct {
	Id        int    `json:"id"`
	Name      string `json:"name"`
	CreatedAt string `json:"createdAt" db:"created_at"`
	Private   bool   `json:"private" db:"private"`
	AdminId   int    `json:"adminId" db:"admin_id"`
}

func (g *Group) CreateNewGroup(c *gin.Context, userId int, name string, private bool, passwordHash string) (*Group, error) {
	sql := `INSERT INTO Groups (admin_id, name, private, password_hash) VALUES ($1, $2, $3, $4)
			RETURNING id, admin_id, name, created_at, private`
	group := Group{}
	tx := db.MustBegin()
	tx.QueryRowx(sql, userId, name, private, utils.NewNullString(passwordHash)).StructScan(&group)
	sql = `INSERT INTO UserGroups (user_id, group_id) VALUES ($1, $2)`
	tx.Exec(sql, userId, group.Id)
	err := tx.Commit()
	if err != nil {
		return nil, err
	}
	return &group, nil
}

type GroupWithMemberCount struct {
	Group
	MemberCount int `json:"memberCount" db:"member_count"`
}

func (g *Group) GetGroupById(c *gin.Context, groupId int) (*GroupWithMemberCount, error) {
	sql := `SELECT G.id, name, created_at, private, admin_id, COUNT(UG.id) as member_count
			FROM Groups G LEFT JOIN UserGroups UG ON G.id = UG.group_id WHERE G.id = $1 GROUP BY G.id`
	result := GroupWithMemberCount{}
	err := db.Get(&result, sql, groupId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (g *Group) GetGroupPasswordHashById(c *gin.Context, groupId int) (*string, error) {
	sql := `SELECT password_hash FROM Groups WHERE id = $1`
	result := ""
	err := db.Get(&result, sql, groupId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (g *Group) GetGroups(c *gin.Context, search string) (*[]Group, error) {
	result := []Group{}
	sql := `SELECT id, name, created_at, private, admin_id FROM Groups WHERE LOWER(name) LIKE '%' || $1 || '%'`
	err := db.Select(&result, sql, strings.ToLower(search))
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (g *Group) AddUserToGroup(c *gin.Context, userId, groupId int) error {
	sql := `INSERT INTO UserGroups (user_id, group_id) VALUES ($1, $2)`
	_, err := db.Exec(sql, userId, groupId)
	if err != nil {
		return err
	}
	return nil
}

func (g *Group) IsPrivateGroup(c *gin.Context, groupId int) (bool, error) {
	var isPrivate bool
	sql := `SELECT private FROM Groups WHERE id=$1`
	err := db.QueryRow(sql, groupId).Scan(&isPrivate)
	if err != nil {
		return false, err
	}
	return isPrivate, nil
}

func (g *Group) IsUserInGroup(c *gin.Context, userId, groupId int) (bool, error) {
	var exists bool
	sql := `SELECT EXISTS(SELECT 1 FROM UserGroups WHERE user_id=$1 AND group_id = $2)`
	err := db.QueryRow(sql, userId, groupId).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (g *Group) GetGroupsByUserId(c *gin.Context, userId int) (*[]Group, error) {
	sql := `SELECT G.id as id, name, created_at, private, admin_id FROM UserGroups UG JOIN Groups G ON G.id = UG.group_id WHERE UG.user_id=$1`
	result := []Group{}
	err := db.Select(&result, sql, userId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (g *Group) RemoveUserFromGroup(c *gin.Context, userId, groupId int) error {
	sql := `DELETE FROM UserGroups WHERE user_id=$1 AND group_id=$2`
	_, err := db.Exec(sql, userId, groupId)
	if err != nil {
		return err
	}
	return nil
}

func (g *Group) GetUsersInGroup(c *gin.Context, groupId int) (*[]UserData, error) {
	sql := `SELECT U.id, U.username FROM UserGroups UG JOIN Users U ON UG.user_id=U.id WHERE UG.group_id=$1`
	result := []UserData{}
	err := db.Select(&result, sql, groupId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
