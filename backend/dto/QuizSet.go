package dto

type QuizSetCreateForm struct {
	QuizSetName string `db:"quiz_set_name" json:"quiz_set_name" example:"퀴즈셋 이름"`
	QuizSetAuthorUserName string `json:"quiz_set_author_name" example:"퀴즈셋 생성자 로그인 아이디"`
	Quizes []QuizCreateForm
	TotalScore uint16 `db:"total_score" json:"total_score" example:"100"`
}

type QuizSetGetForm struct {
	QuizSetId int64 `json:"quiz_set_id" example:"1234"`
	QuizSetName string `json:"quiz_set_name" example:"퀴즈셋 이름"`
	QuizSetAuthorUserName string `json:"quiz_set_author_name" example:"퀴즈셋 생성자 로그인 아이디"`
	Quizzes []QuizGetForm
	TotalScore uint16 `json:"total_score" example:"100"`
}

