package chatbot

import (
	"github.com/stretchr/testify/assert"
	"oss/chatbot"
	"strconv"
	"strings"
	"testing"
)

func TestMakeActionMethodNameForQuizCard(t *testing.T) {
	var quizId int64 =  1
	email := "hello@world.com"
	classQuizSetId := "9999"
	buttonIndex := "2"

	result := chatbot.MakeActionMethodNameForQuizCard(quizId, email, classQuizSetId, buttonIndex)
	result = result[strings.Index(result, ":") + 1:]
	tokens := strings.Split(result, "-")
	assert.Equal(t, tokens[0], email)
	assert.Equal(t, tokens[1], classQuizSetId)
	assert.Equal(t, tokens[2], strconv.FormatInt(quizId, 10))
	assert.Equal(t, tokens[3], buttonIndex)

}
