package models

type QuizResult struct {
	QuizResultId int64 `db:"quiz_result_id" json:"quiz_result_id"`
	QuizSetResultId int64 `db:"quiz_set_result_id" json:"quiz_set_result_id"`
	UserId int64 `db:"user_id" json:"user_id"`
	QuizId int64 `db:"quiz_id" json:"quiz_id"`
	Correct bool `db:"correct" json:"correct"`
}