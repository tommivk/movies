package enums

type NotificationType int

const (
	Welcome NotificationType = iota
	FriendRequest
	AcceptFriendRequest
	DeniedFriendRequest
	NewMovieRecommendation
)

func (n NotificationType) ToString() string {
	return [...]string{"welcome", "friend_request", "accepted_friend_request", "denied_friend_request", "new_movie_recommendation"}[n]
}
