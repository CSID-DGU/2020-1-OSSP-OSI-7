package dto

type User struct {
	UserId int64 `db:"user_id" json:"user_id"`
	NickName string `db:"nickname" json:"nickname"`
	UserName string `db:"username" json:"username"`
}
