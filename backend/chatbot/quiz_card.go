package chatbot

import (
	"encoding/json"
	"google.golang.org/api/chat/v1"
	"oss/dto"
	"oss/models"
	"strconv"
)

/*

 */

func makeButtonWidgetForCard(email string, quizId int64, choice *dto.Choice) *chat.WidgetMarkup {
	buttonIndex := strconv.Itoa(choice.Index)
	return &chat.WidgetMarkup{
		Buttons: []*chat.Button{
			&chat.Button{
				ImageButton: nil,
				TextButton: &chat.TextButton{
					Text:  buttonIndex + " : " + choice.Choice,
					OnClick: &chat.OnClick{
						Action: &chat.FormAction{
							ActionMethodName:
								"ACTION:SUBMIT_ANSWER:"+email+"-"+strconv.FormatInt(quizId, 10)+"-"+buttonIndex,
						},
						OpenLink: nil,
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

func makeButtonWidgetsForCard(email string, quizId int64, multiQuizContent *dto.MultiQuizContent) []*chat.WidgetMarkup {
	result := []*chat.WidgetMarkup{}
	for _, content := range multiQuizContent.Choices {
		result = append(result, makeButtonWidgetForCard(email, quizId, content))
	}
	return result
}

func makeQuizCard(email string, quiz *models.Quiz) *chat.Message {

	content := []byte(quiz.QuizContent)
	if quiz.QuizType == models.QUIZ_TYPE_MULTI {
		var contentStruct *dto.MultiQuizContent
		err := json.Unmarshal(content, &contentStruct)
		if err != nil {

		} else {
			return &chat.Message{
				Text: quiz.QuizTitle,
				Cards: []*chat.Card{
					&chat.Card{
						Name: "card name",
						Sections: []*chat.Section{
							&chat.Section{
								Widgets:         makeButtonWidgetsForCard(email, quiz.QuizId, contentStruct),
								ForceSendFields: nil,
								NullFields:      nil,
							},
						},
					},
				},
			}
		}

	}
	return nil

}
