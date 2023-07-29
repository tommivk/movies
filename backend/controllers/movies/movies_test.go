package movies

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
