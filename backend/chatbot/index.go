package chatbot

import (
	"oss/models"
	"strings"
)

var startTestCommand Command  = Command {
	Cmd: "퀴즈응시",
	MaxParam: 1,
	MinParam: 1,
	MustParam: []int{0},
	Options: map[string]int{
		"퀴즈코드" : 0,
	},
	Entry: StartTestEntry,
}

var commandTable = map[string]Command {
	startTestCommand.Cmd : startTestCommand,
}


type AbstractMessage interface {
	Process(email string) (interface{}, *models.AppError)
}

type Answer struct {
	value string
}

// token 을 받아서 해당하는 메세지를 concrete object 로 만들어 반환
func InitialProcess(tokens []string) AbstractMessage {
	// 커맨드 입력인지 확인
	tokens = tokens[1:]
	for _, cmd := range commandTable {
		if cmd.Cmd == tokens[0] {
			return &CommandMessage{ &cmd, tokens }
		}
	}
	return &Answer {value : strings.Join(tokens, " ")}
}

func (a *Answer) Process(email string) (interface{}, *models.AppError) {
	/*
		3. 객관식 답안 제출이랑 단답형 답안 제출이 있음
		4. 채점스케쥴러에 입력
		5. 다음 퀴즈 혹은 퀴즈를 다 풀었음을 알리는 메시지 출력
	 */
	return nil, nil
}

func (a *Answer) fetchNext(userEmail string) (interface{}, *models.AppError) {
	/*
		if [ len(user submitted quiz) >= len(quiz set's quizzes) ]
			return END MESSAGE

		getQuizSetId = get from redis with user email
	 	nextQuizIndex = pop from Redis <user will solve quiz queue>
		nextQuiz = get from Redis using "getQuizSetId, nextQuizIndex"
		Redis 채점 큐에 넣기
		return nextQuiz
	 */
	return nil, nil
}

func ParseMessage (s string) {


	if len(s) == 0 {

	}

}
