package models

type QuizSetResult struct {
	QuizSetResultId int64 `db:"quiz_set_result_id" json:"quiz_set_result_id"`
	ClassQuizSetId int64 `db:"class_quiz_set_id" json:"class_quiz_set_id"`
	UserId int64 `db:"user_id" json:"user_id"`
	MyScore uint64 `db:"my_score" json:"my_score"`
}