package models

const (
	QUIZ_TYPE_MULTI = "MULTI"
	QUIZ_TYPE_SHORT = "SHORT"
)
type Quiz struct {
	QuizId int64 `db:"quiz_id" json:"quiz_id"`
	QuizSetId int64 `db:"quiz_set_id" json:"quiz_set_id"`
	QuizTitle string `db:"quiz_title" json:"quiz_title"`
	QuizContent string `db:"quiz_content" json:"quiz_content"`
	QuizType string `db:"quiz_type" json:"quiz_type"`
	QuizScore uint64 `db:"quiz_score" json:"quiz_score"`
	QuizAnswer string `db:"quiz_answer" json:"quiz_answer"`
}