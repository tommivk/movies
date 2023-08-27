package models

import (
	"log"
	"movies/utils"
	"os"

	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB

func InitDB(connStr string) error {
	var err error
	db, err = sqlx.Open("postgres", connStr)
	if err != nil {
		return err
	}
	err = createTables()
	if err != nil {
		return err
	}
	return db.Ping()
}

func createTables() error {
	sql, err := os.ReadFile("./tables.sql")
	if err != nil {
		log.Println("failed to read ./tables.sql", err)
		return err
	}
	_, err = db.Exec(string(sql))
	if err != nil {
		log.Println("Failed to create tables", err)
		return err
	}
	return nil
}

func AddTestUser() error {
	passwordHash, err := utils.HashPassword("tester")
	if err != nil {
		log.Println("Failed to hash testuser password: ", err)
		return err
	}
	sql := `INSERT INTO USERS(username, password_hash) VALUES($1, $2)
			ON CONFLICT DO NOTHING`
	_, err = db.Exec(sql, "tester", passwordHash)
	if err != nil {
		log.Println("Failed to create test user", err)
		return err
	}
	return nil
}
