package dto

type QuizCreateForm struct {
	QuizTitle string `json:"quiz_title" example:"퀴즈 문제"`
	QuizContent string `json:"quiz_content" example:"퀴즈 렌더링 정보"`
	QuizAnswer string `json:"quiz_answer" example:"퀴즈 정답"`
	QuizType string `json:"quiz_type" example:"퀴즈 타입(객관식, 주관식)"`
}

type QuizGetForm struct {
	QuizId int64 `json:"quiz_id" example:"1234"`
	QuizTitle string `json:"quiz_title" example:"퀴즈 문제"`
	QuizContent string `json:"quiz_content" example:"퀴즈 렌더링 정보"`
	QuizAnswer string `json:"quiz_answer" example:"퀴즈 정답"`
	QuizType string `json:"quiz_type" example:"퀴즈 타입(객관식, 주관식)"`
}