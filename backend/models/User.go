package models

type User struct {
	UserId int64 `db:"user_id" json:"user_id"`
	StudentCode int64 `db:"student_code" json:"student_code"`
	Email string `db:"email" json:"email"`
	NickName string `db:"nickname" json:"nickname"`
	UserName string `db:"username" json:"username"`
	Password string `db:"password" json:"password"`
	Authority string `db:"authority" json:"authority"`
	Admin bool `db:"admin" json:"admin"`
}
