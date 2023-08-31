package forms

type NewGroup struct {
	Name     string `binding:"required" form:"name"`
	Private  bool   `form:"private"`
	Password string `form:"password"`
}

type JoinGroup struct {
	Password string
}

type NewComment struct {
	Comment string `binding:"required"`
}
