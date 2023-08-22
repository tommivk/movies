package forms

type MovieRecommendation struct {
	GroupId     int `binding:"required"`
	MovieId     int `binding:"required"`
	Description string
}
