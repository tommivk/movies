package forms

type NewGroup struct {
	Name     string `binding:"required"`
	Private  bool
	Password string
}

type JoinGroup struct {
	Password string
}
