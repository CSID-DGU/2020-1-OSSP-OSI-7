package dto

type User struct {
	UserId int64 `db:"user_id" json:"-"`
	UserName string `db:"username" json:"username" example:"pigeon1234"`
	StudentCode int64 `db:"student_code" json:"student_code" example:"2015123456"`
	Email string `db:"email" json:"email" example:"donggukmail@dgu.ac.kr"`
	NickName string `db:"nickname" json:"nickname" example:"my nickname"`
}
