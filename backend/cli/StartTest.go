package cli

import (
	"oss/models"
	"oss/web"
	"strconv"
)

type Res struct {
	Text string `json:"text"`
}

func StartTest(studentNumber int64, quizTitle string) (interface{}, *models.AppError){
	res := &Res {
		Text : strconv.FormatInt(studentNumber, 10) + " 님의 [" +quizTitle+"] 퀴즈 응시를 시작합니다."  ,
	}
	return res, nil
}

func StartTestEntry(args map[int]string) (interface{}, *models.AppError) {
	// 1: 학번 2: 퀴즈이름
	studentNumber, err := strconv.ParseInt(args[0], 10, 64)

	if err != nil {
		return nil, NewCliAppError(
			OPTION_VALUE_TYPE_ERROR,START_QUIZ + "에 주어진 학번" + args[0] + "이 유효하지 않습니다.")
	}

	_, cliErr := web.Context0.Repositories.UserRepository().GetByStudentCode(studentNumber)

	if cliErr != nil {
		return nil, NewCliAppError(
			OPTION_VALUE_TYPE_ERROR,"학번에 해당하는 유저가 존재하지 않습니다")
	}

	quizName := args[2]
	//TODO 퀴즈이름에 따라 처리

	return StartTest(studentNumber, quizName)
}

