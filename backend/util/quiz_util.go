package util

import (
	"math/rand"
	"oss/models"
	"time"
)

func MakeMockQuizWithOnlyQuizId(quizId int64) models.Quiz {
	return models.Quiz{
		QuizId:      quizId,
		QuizSetId:   0,
		QuizTitle:   "컴퓨터공학과 학생들이 있는 건물을 고르시오",
		QuizContent: "",
		QuizType:    "",
		QuizScore:   0,
		QuizAnswer:  "",
	}
}

func ShuffleQuizzes(quizzes []models.Quiz) []models.Quiz {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(quizzes), func(i, j int) {
		quizzes[i], quizzes[j] = quizzes[j], quizzes[i]
	})
	return quizzes
}
