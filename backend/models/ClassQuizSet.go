package models

type ClassQuizSet struct {
	ClassQuizSet int64 `db:"class_quiz_set" json:"class_quiz_set"`
	QuizSetId int64 `db:"quiz_set_id" json:"quiz_set_id"`
	ClassId int64 `db:"class_id" json:"class_id"`
}