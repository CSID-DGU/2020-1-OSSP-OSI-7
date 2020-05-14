package models

type QuizSet struct {
	QuizSetId int64 `db:"quiz_set_id" json:"quiz_set_id"`
	UserId int64 `db:"user_id" json:"user_id"`
	QuizSetName string `db:"quiz_set_name" json:"quiz_set_name"`
	TotalScore uint16 `db:"total_score" json:"total_score"`
}