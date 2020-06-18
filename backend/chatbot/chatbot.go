package chatbot

import (
	"github.com/sirupsen/logrus"
	"google.golang.org/api/chat/v1"
	"oss/dto"
	"oss/hangout"
	"oss/models"
	"oss/redisUtil"
	"oss/service"
	_ "oss/service"
	"oss/test/utils"
	"oss/web"
	"strconv"
	_ "strconv"
	"strings"
	_ "strings"
)

const (
	SUBMIT_MULTI_ANSWER = "SUBMIT_MULTI_ANSWER"
)

func analysisSubmitAnswer (){

}

func submitAnswerProcessor (c *web.Context, content string) *chat.Message {
	tokens := strings.Split(content, "-")
	email := tokens[0]
	classQuizSetId := tokens[1]
	quizId := tokens[2]
	buttonIndex := tokens[3]

	parsedClassQuizSetId, err := strconv.ParseInt(classQuizSetId, 10, 64)
	parsedQuizId, err := strconv.ParseInt(quizId, 10, 64)
	if err != nil {
		return InternalServerError()
	}
	score_err := service.ScoreQuizzes(c,
		service.ScoringQueueIdent{
		ClassQuizSetId: parsedClassQuizSetId,
		Email:          email },
		[]*dto.QuizForScoring{
			{
				QuizId:     parsedQuizId,
				QuizType:   models.QUIZ_TYPE_MULTI,
				QuizAnswer: buttonIndex,
			},
	})

	if score_err != nil {
		return ChatbotServiceError(score_err.DetailedError)
	}

	conn := web.Context0.Redis.Get()
	defer utils.CloseRedisConnection(&conn)
	_, redis_err :=  redisUtil.RedisPopFromQueue(&conn, email)
	if redis_err != nil {
		web.Logger.WithFields(logrus.Fields{
			"email": email,
			"redis_err": redis_err,
		}).Warn("Failed to fetch classQuizSetId from user with email")
	}
	return GetNextQuiz(c, email)
}

func ProcessChat(c *web.Context, event hangout.DquizDeprecatedEvent) *chat.Message {
	//email := event.User.Email
	//message := strings.Fields(event.Message.Text)
	if event.Type == "CARD_CLICKED" {
		action := event.Action.ActionMethodName
		content := action[strings.Index(action, ":") + 1:]
		methodPrefixPosition := strings.Index(action, ":")
		methodPrefix := action[0 : methodPrefixPosition]
		switch methodPrefix {
			case "SUBMIT_MULTI_ANSWER":
				return submitAnswerProcessor(c, content)
			case "SUBMIT_SHORT_ANSWER":
				return submitAnswerProcessor(c, content)
		}
	} else {

	}
	return nil
}
