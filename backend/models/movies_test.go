package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAppendGenreToMovie(t *testing.T) {
	movie := Movie{}
	appendGenreToMovie(35, &movie)
	want := []Genre{{Id: 35, Name: "Comedy"}}
	assert.Equal(t, want, movie.Genres)
}

func TestAppendGenresToSearchResult(t *testing.T) {
	adventure := Genre{Id: 12, Name: "Adventure"}
	action := Genre{Id: 28, Name: "Action"}
	comedy := Genre{Id: 35, Name: "Comedy"}
	history := Genre{Id: 36, Name: "History"}

	movie := Movie{GenreIds: []int{12, 35}}
	movie2 := Movie{GenreIds: []int{28, 36}}
	searchResult := SearchResult{Results: []Movie{movie, movie2}}
	appendGenresToSearchResult(&searchResult)
	want := []Genre{adventure, comedy}
	assert.Equal(t, want, searchResult.Results[0].Genres)
	want = []Genre{action, history}
	assert.Equal(t, want, searchResult.Results[1].Genres)
}

func TestFindOfficialTrailer(t *testing.T) {
	videos := []Video{
		{Key: "teaser", Site: "YouTube", Type: "Teaser", Official: true},
		{Key: "unofficial", Site: "YouTube", Type: "Trailer", Official: false},
		{Key: "vimeo", Site: "Vimeo", Type: "Trailer", Official: true},
		{Key: "official", Site: "YouTube", Type: "Trailer", Official: true},
		{Key: "official2", Site: "YouTube", Type: "Trailer", Official: true},
	}
	trailer := findOfficialTrailer(videos)
	assert.NotNil(t, trailer)
	assert.Equal(t, "official", trailer.Key)

	assert.Nil(t, findOfficialTrailer(videos[:3]))
	assert.Nil(t, findOfficialTrailer(nil))
}
