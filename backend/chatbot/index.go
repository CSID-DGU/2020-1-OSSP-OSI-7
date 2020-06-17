package chatbot

import "strings"

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

// token 을 받아서 해당하는 메세지를 concrete object 로 만들어 반환
func InitialProcess(tokens []string) AbstractMessage {
	// 커맨드 입력인지 확인
	tokens = tokens[1:]
	for _, cmd := range commandTable {
		if cmd.Cmd == tokens[0] {
			return &CommandMessage{ &cmd, tokens }
		}
	}
	return &AnswerMessage {value : strings.Join(tokens, " ")}
}
