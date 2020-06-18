package dto

type QuizCreateForm struct {
	QuizTitle string `json:"quiz_title" example:"퀴즈 문제"`
	QuizContent string `json:"quiz_content" example:"퀴즈 렌더링 정보"`
	QuizAnswer string `json:"quiz_answer" example:"퀴즈 정답"`
	QuizType string `json:"quiz_type" example:"퀴즈 타입(MULTI 혹은 SIMPLE)"`
	QuizScore uint64 `json:"quiz_score" example:"35"`
}

type QuizGetForm struct {
	QuizId int64 `json:"quiz_id" example:"1234"`
	QuizTitle string `json:"quiz_title" example:"퀴즈 문제"`
	QuizContent string `json:"quiz_content" example:"퀴즈 렌더링 정보"`
	QuizAnswer string `json:"quiz_answer" example:"퀴즈 정답"`
	QuizType string `json:"quiz_type" example:"퀴즈 타입(MULTI 혹은 SIMPLE)"`
}

type QuizAnswerWithScore struct {
	QuizAnswer string `db:"quiz_answer" json:"quiz_answer"`
	QuizScore uint64 `db:"quiz_score" json:"quiz_score"`
}

/*
객관식
quiz_type : MULTI,
quiz_content : {

}

 */

type Choice struct {
	Index int `json:"index"`
	Choice string `json:"choice"`
}
type MultiQuizContent struct {
	Choices []*Choice `json:"choices"`
}

type ShortQuizContent struct {
	Text string
}