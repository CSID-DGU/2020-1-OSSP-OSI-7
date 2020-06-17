package dto

type QuizSetForScoring struct {
	ClassQuizSetId int64 `json:"class_quiz_set_id" example:"1234"`
	UserName string `json:"username" example:"유저 이메일"`// email 과 같음
	QuizForScorings []*QuizForScoring `json:"quiz_for_scorings"`
}

type QuizForScoring struct {
	QuizId int64 `redis:"qid" json:"quiz_id"`
	QuizType string `redis:"qtype" json:"quiz_type"`
	QuizAnswer string `redis:"qans" json:"quiz_answer"`
}


