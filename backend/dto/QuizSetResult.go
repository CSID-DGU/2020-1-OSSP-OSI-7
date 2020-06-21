package dto

type GetQuizSetResults struct {
	QuizSetResults []*GetQuizSetResult `json:"quiz_set_results"`
}

type GetQuizSetResult struct {
	ClassQuizSetId string `db:"class_quiz_set_id" json:"class_quiz_set_id"`
	QuizSetName string `db:"quiz_set_name" json:"quiz_set_name"`
	ClassName string `db:"class_name" json:"class_name"`
	ClassCode string `db:"class_code" json:"class_code"`
	TotalScore int `db:"total_score" json:"total_score"`
	MyScore int `db:"my_score" json:"my_score"`
}
