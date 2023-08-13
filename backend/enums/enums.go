package enums

type NotificationType int

const (
	Info NotificationType = iota
	FriendRequest
	AcceptFriendRequest
	DeniedFriendRequest
)

func (n NotificationType) ToString() string {
	return [...]string{"info", "friend_request", "accepted_friend_request", "denied_friend_request"}[n]
}
