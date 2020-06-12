package service

import (
	"encoding/json"
	"fmt"
	"github.com/gomodule/redigo/redis"
	"github.com/stretchr/testify/assert"
	"oss/chatbot"
	"oss/dto"
	"oss/models"
	"oss/util"
	"testing"
)

type Foo struct {
	ch chan int
}

var foo *Foo = &Foo{
	ch: make(chan int),
}

type Person struct {
	Name string `redis:"name"`
	Age  int    `redis:"age"`
}

func RetrievePerson(conn redis.Conn, id string) (Person, error) {
	var person Person

	values, err := redis.Values(conn.Do("HGETALL", fmt.Sprintf("quizScoring:%s", id)))
	if err != nil {
		return person, err
	}

	err = redis.ScanStruct(values, &person)
	return person, err
}

func makeMockQuizWithOnlyQuizId(quizId int64) models.Quiz {
	return models.Quiz{
		QuizId:      quizId,
		QuizSetId:   0,
		QuizTitle:   "",
		QuizContent: "",
		QuizType:    "",
		QuizScore:   0,
		QuizAnswer:  "",
	}
}

func TestShuffleQuiz(t *testing.T) {
	quizzes := []models.Quiz{
		makeMockQuizWithOnlyQuizId(1),
		makeMockQuizWithOnlyQuizId(2),
		makeMockQuizWithOnlyQuizId(3),
		makeMockQuizWithOnlyQuizId(4),
	}
	util.ShuffleQuizzes(quizzes)
	assert.Equal(t, len(quizzes), 5)
}

func TestMakeQuizCard(t *testing.T) {
	quiz := makeMockQuizWithOnlyQuizId(1)
	quiz.QuizType = models.QUIZ_TYPE_MULTI
	quizContent := &dto.MultiQuizContent{}
	quizContent.Choices = []*dto.Choice {
		&dto.Choice{
			Index:1,
			Choice: "원흥관",
		},
		&dto.Choice{
			Index:2,
			Choice: "신공학관",
		},
	}
	result, err := json.Marshal(quizContent)
	if err != nil {

	}
	quiz.QuizContent = string(result)
	msg := chatbot.MakeQuizCard(&quiz);
	println(msg)

}