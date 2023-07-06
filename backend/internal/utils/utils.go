package utils

import (
	"errors"
	"io/ioutil"
	"movies/internal/constants"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func FetchData(url string) ([]byte, error) {
	res, err := http.Get(url)
	if res.StatusCode == 404 {
		return nil, errors.New(constants.NotFound)
	}
	if err != nil {
		return nil, err
	}
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return nil, errors.New("Failed to fetch")
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func ValidatePassword(passwordHash, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))
	return err
}
