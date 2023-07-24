package forms

type Credentials struct {
	Username string `binding:"required"`
	Password string `binding:"required"`
}

type MovieRating struct {
	Rating int `binding:"required"`
}
