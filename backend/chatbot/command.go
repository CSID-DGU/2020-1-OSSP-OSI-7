package chatbot

import "oss/models"

var (
	START_QUIZ = "퀴즈응시"
	COMMAND_NOT_EXISTS = "존재하지 않는 명렁어입니다."
	LACK_OF_NECESSARY_TOKEN = "최소 옵션 개수를 만족하지 않았습니다."
	TOO_MANY_OPTIONS = "옵션이 너무 많습니다."
	INVALID_OPTION_PAIR = "옵션과 값의 짝이 맞지 않습니다"
	NO_NECESSARY_OPTION = "필수적인 옵션이 입력되지 않았습니다"
	OPTION_VALUE_TYPE_ERROR = "옵션에 제공된 값의 타입이 올바르지 않습니다"
)

func NewCliAppError(msg string, detail string) (*models.AppError) {
	return &models.AppError{Message: msg, DetailedError: detail, StatusCode: 400}
}


type CommandMessage struct {
	*Command
	tokens []string
}

type Command struct {
	Cmd string
	MaxParam int
	MinParam int
	MustParam []int
	Options map[string]int
	Entry func(string, map[int]string) (interface{}, *models.AppError)
}

func (c *CommandMessage) Process(email string) (interface{}, *models.AppError){
	var numberOfOptions int = (len(c.tokens) -1) / 2
	if len(c.tokens) == 0 {
		return nil, NewCliAppError(COMMAND_NOT_EXISTS, "명령어를 입력해주세요")
	}

	if numberOfOptions < c.MinParam {
		return nil, NewCliAppError(LACK_OF_NECESSARY_TOKEN, "[" + c.tokens[0] + "] 명령어는 최소 " + string(c.MinParam) + "개의 옵션이 필요합니다")
	}

	if numberOfOptions / 2 > c.MaxParam {
		return nil, NewCliAppError( TOO_MANY_OPTIONS, "[" + c.tokens[0] + "] 명령어는 최대 " + string(c.MaxParam) + "개의 옵션만 제공할 수 있습니다.")
	}

	extractedOptions := make(map[int]string)
	shouldOptionValue := false
	// 토큰 유효성 검사 모듈
	for i := 1; i < len(c.tokens); i++ {
		if shouldOptionValue {
			if c.tokens[i][0] == '-' {
				return nil, NewCliAppError(INVALID_OPTION_PAIR, INVALID_OPTION_PAIR)
			} else {
				shouldOptionValue = false
				extractedOptions[c.Options[c.tokens[i-1][1:]]] = c.tokens[i]
			}
		} else {
			if c.tokens[i][0] != '-' {
				return nil, NewCliAppError(INVALID_OPTION_PAIR, INVALID_OPTION_PAIR)
			} else {
				if _, ok := c.Options[c.tokens[i][1:]]; !ok {
					return nil, NewCliAppError(INVALID_OPTION_PAIR, INVALID_OPTION_PAIR)
				}
				shouldOptionValue = true
			}
		}
	}

	// 필수 옵션이 들어왔는지 체크
	for i := 0; i < len(c.MustParam); i++ {
		if _, ok := extractedOptions[c.MustParam[i]]; !ok {
			return nil, NewCliAppError(NO_NECESSARY_OPTION, NO_NECESSARY_OPTION + " | @dquiz <명령어> 를 이용해 사용 방법을 확인해주세요.")
		}
	}

	return c.Entry(email, extractedOptions)
}
