package utils

import (
	"errors"
	"fmt"
	"io/ioutil"
	"movies/constants"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
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
		return nil, errors.New(fmt.Sprintf("Failed to fetch, status: %d", res.StatusCode))
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

func TokenForUser(userId int, username, secret string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := make(jwt.MapClaims)
	claims["exp"] = time.Now().UTC().Add(72 * time.Hour).Unix()
	claims["username"] = username
	claims["userId"] = userId
	token.Claims = claims

	res, err := token.SignedString([]byte(secret))
	return res, err
}

func ParseToken(tokenString, secret string) (jwt.MapClaims, *jwt.ValidationError) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.NewValidationError("Invalid token", jwt.ValidationErrorUnverifiable)
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err.(*jwt.ValidationError)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, jwt.NewValidationError("Invalid token", jwt.ValidationErrorMalformed)
}
