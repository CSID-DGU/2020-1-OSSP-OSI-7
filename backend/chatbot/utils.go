package chatbot

import (
	"google.golang.org/api/chat/v1"
	"google.golang.org/api/googleapi"
)

const (
	INTERNAL_SERVER_ERROR = "잠시 후 다시 시도해주세요."
)

func InternalServerError() *chat.Message {
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


func UnauthorizedError() *chat.Message {
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
		Text:            `Dquiz 에 등록되어 있는 유저가 아닙니다. 가입 후에 재시도 해주세요.
가입이 되어있음에도 불구하고 이 메세지를 받았다면, 잠시 후에 다시 시도 해주세요.`,
		Thread:          nil,
		ServerResponse:  googleapi.ServerResponse{},
		ForceSendFields: nil,
		NullFields:      nil,
	}
}


func ChatbotServiceError(detail string) *chat.Message {
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
		Text:            detail,
		Thread:          nil,
		ServerResponse:  googleapi.ServerResponse{},
		ForceSendFields: nil,
		NullFields:      nil,
	}
}