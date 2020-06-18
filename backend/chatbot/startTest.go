package chatbot

import (
	"oss/models"
	"oss/redisUtil"
	"oss/web"
	"strconv"
)

type TextMessage struct {
	Text string `json:"text"`
}

type TextButton struct {
}


// Redis 리스트에 랜덤하게 퀴즈셋을 넣는다
// 유저가 답을 제출할 때 마다 리스트에서 하나씩 pop 한다.
func StartTest(email string, classQuizSetId int64) (interface{}, *models.AppError) {
	conn := web.Context0.Redis.Get()
	redisUtil.MakeQuizQueue(web.Context0, email, classQuizSetId)
	redisUtil.RedisSet(&conn,
					   redisUtil.TestingClassQuizSetIdKey(email),
					   strconv.FormatInt(classQuizSetId, 10), redisUtil.HOUR )
	/*


	res := &chat.Message{
		Text: strconv.FormatInt(studentNumber, 10) + " 님의 [" + quizTitle + "] 퀴즈 응시를 시작합니다.",
		Cards: []*chat.Card{
			&chat.Card{
				Header: &chat.CardHeader{
					ImageStyle:      "",
					ImageUrl:        "https://i.pinimg.com/236x/df/b2/4f/dfb24f83e60e7488c8b50456ad34e4db--the-clouds.jpg",
					Subtitle:        "",
					Title:           "동국대학교에 없는 건물을 고르시오.",
					ForceSendFields: nil,
					NullFields:      nil,
				},
				Name: "card name",
				Sections: []*chat.Section{
					&chat.Section{
						Header: "5지선다",
						Widgets: []*chat.WidgetMarkup{
							&chat.WidgetMarkup {
								Buttons: []*chat.Button {
									&chat.Button {
										ImageButton:     nil,
										TextButton:      &chat.TextButton{
											Text: "1. 상록원",
											OnClick: &chat.OnClick{
												Action:  &chat.FormAction{
													ActionMethodName: "ACTTTTION",
												},
												OpenLink:        nil,
												ForceSendFields: nil,
												NullFields:      nil,
											},
										},
										ForceSendFields: nil,
										NullFields:      nil,
									},
								},
							},
							&chat.WidgetMarkup {
								Buttons: []*chat.Button {
									&chat.Button {
										ImageButton:     nil,
										TextButton:      &chat.TextButton{
											Text: "2. 원흥관",
											OnClick: &chat.OnClick{
												Action:  &chat.FormAction{
													ActionMethodName: "ACTTTTION",
												},
												OpenLink:        nil,
												ForceSendFields: nil,
												NullFields:      nil,
											},
										},
										ForceSendFields: nil,
										NullFields:      nil,
									},
								},
							},
							&chat.WidgetMarkup {
								Buttons: []*chat.Button {
									&chat.Button {
										ImageButton:     nil,
										TextButton:      &chat.TextButton{
											Text: "3. 신공학관",
											OnClick: &chat.OnClick{
												Action:  &chat.FormAction{
													ActionMethodName: "ACTTTTION",
												},
												OpenLink:        nil,
												ForceSendFields: nil,
												NullFields:      nil,
											},
										},
										ForceSendFields: nil,
										NullFields:      nil,
									},
								},
							},
							&chat.WidgetMarkup {
								Buttons: []*chat.Button {
									&chat.Button {
										ImageButton:     nil,
										TextButton:      &chat.TextButton{
											Text: "4. 언더우드관",
											OnClick: &chat.OnClick{
												Action:  &chat.FormAction{
													ActionMethodName: "ACTTTTION",
												},
												OpenLink:        nil,
												ForceSendFields: nil,
												NullFields:      nil,
											},
										},
										ForceSendFields: nil,
										NullFields:      nil,
									},
								},
							},
							&chat.WidgetMarkup {
								Buttons: []*chat.Button {
									&chat.Button {
										ImageButton:     nil,
										TextButton:      &chat.TextButton{
											Text: "5. 정보문화관",
											OnClick: &chat.OnClick{
												Action:  &chat.FormAction{
													ActionMethodName: "ACTTTTION",
												},
												OpenLink:        nil,
												ForceSendFields: nil,
												NullFields:      nil,
											},
										},
										ForceSendFields: nil,
										NullFields:      nil,
									},
								},
				cd new				},
						},
						ForceSendFields: nil,
						NullFields:      nil,
					},
				},
			},
		},
	}
	 */
	msg := GetNextQuiz(web.Context0, email)
	if msg == nil {
		// TODO 에러처리(퀴즈를 가져오지 못하는 경우)
		return nil, models.NewAppError(nil, "really", "bad")
	}
	return msg, nil
}

func StartTestEntry(email string, args map[int]string) (interface{}, *models.AppError) {
	//1. 퀴즈셋아이디

	/*
		if err != nil {

			return nil, NewCliAppError(
				OPTION_VALUE_TYPE_ERROR,START_QUIZ + "에 주어진 학번" + args[0] + "이 유효하지 않습니다.")
		}

		_, cliErr := web.Context0.Repositories.UserRepository().GetByStudentCode(studentNumber)

		if cliErr != nil {
			return nil, NewCliAppError(
				OPTION_VALUE_TYPE_ERROR,"학번에 해당하는 유저가 존재하지 않습니다")
		}
	*/
	classQuizSetId, err := strconv.ParseInt(args[0], 10, 64)
	if err != nil {

	}
	return StartTest(email, classQuizSetId)
}
