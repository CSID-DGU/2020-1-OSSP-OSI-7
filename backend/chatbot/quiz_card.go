package chatbot

import (
	"encoding/base64"
	"encoding/json"
	"github.com/sirupsen/logrus"
	"google.golang.org/api/chat/v1"
	"google.golang.org/api/googleapi"
	"oss/dto"
	"oss/models"
	"oss/redisUtil"
	"oss/test/utils"
	"oss/web"
	"strconv"
)

/*

 */
func MakeActionMethodNameForQuizCard(quizId int64, email, classQuizSetId, buttonIndex string) string {
	return SUBMIT_MULTI_ANSWER + ":" + email + "-" + classQuizSetId + "-" + strconv.FormatInt(quizId, 10) + "-" + buttonIndex
}

func makeButtonWidgetForCard(email, classQuizSetId string, quizId int64, choice *dto.Choice) *chat.WidgetMarkup {
	buttonIndex := strconv.Itoa(choice.Index)
	return &chat.WidgetMarkup{
		Buttons: []*chat.Button{
			&chat.Button{
				ImageButton: nil,
				TextButton: &chat.TextButton{
					Text: buttonIndex + " : " + choice.Choice,
					OnClick: &chat.OnClick{
						Action: &chat.FormAction{
							ActionMethodName:
							MakeActionMethodNameForQuizCard(quizId, email, classQuizSetId, buttonIndex),
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
	}
}

func makeButtonWidgetsForCard(email string, quizId int64, multiQuizContent *dto.MultiQuizContent) ([]*chat.WidgetMarkup, *models.AppError) {
	conn := web.Context0.Redis.Get()
	defer utils.CloseRedisConnection(&conn)
	result := []*chat.WidgetMarkup{}
	classQuizSetId, err := redisUtil.RedisGet(
		&conn, redisUtil.TestingClassQuizSetIdKey(email))
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"email":            email,
			"quiz_id":          quizId,
			"multiQuizContent": multiQuizContent,
		}).Warn("Failed to fetch classQuizSetId")
		return nil, err
	}
	for _, content := range multiQuizContent.Choices {
		result = append(result, makeButtonWidgetForCard(email, classQuizSetId, quizId, content))
	}
	return result, nil
}

func makeTextFieldWidgetForCard(email string, shortQuizContent dto.MultiQuizContent) ([]*chat.WidgetMarkup, *models.AppError) {
	return nil, nil
}

func makeQuizCard(email string, quiz *models.Quiz) *chat.Message {
	if quiz.QuizType == models.QUIZ_TYPE_MULTI {
		var contentStruct *dto.MultiQuizContent
		decoded, err := base64.StdEncoding.DecodeString(quiz.QuizContent)
		err = json.Unmarshal(decoded, &contentStruct)
		if err != nil {
			return InternalServerError()
		} else {
			result, make_quiz_err := makeButtonWidgetsForCard(email, quiz.QuizId, contentStruct)

			if make_quiz_err != nil {
				return &chat.Message{
					ActionResponse:  nil,
					Annotations:     nil,
					ArgumentText:    "",
					Cards:           nil,
					CreateTime:      "",
					FallbackText:    "",
					Name:            "",
					PreviewText:     "",
					Sender:          nil,
					Space:           nil,
					Text:            "잠시 후 다시 시도해주세요.",
					Thread:          nil,
					ServerResponse:  googleapi.ServerResponse{},
					ForceSendFields: nil,
					NullFields:      nil,
				}
			}

			return &chat.Message{
				Text: quiz.QuizTitle,
				Cards: []*chat.Card{
					&chat.Card{
						Name: "card name",
						Sections: []*chat.Section{
							&chat.Section{
								Widgets:         result,
								ForceSendFields: nil,
								NullFields:      nil,
							},
						},
					},
				},
			}

		}
	} else if quiz.QuizType == models.QUIZ_TYPE_SHORT {

		return &chat.Message{
			Cards: []*chat.Card{
				&chat.Card{
					Header: &chat.CardHeader{
						ImageStyle:      "",
						ImageUrl:        "",
						Subtitle:        "",
						Title:           quiz.QuizContent,
						ForceSendFields: nil,
						NullFields:      nil,
					},
					Name: "card name",
				},
			},
		}
	}
	return nil
}
