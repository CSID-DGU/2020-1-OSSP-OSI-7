package chatbot

import (
	"google.golang.org/api/chat/v1"
	"google.golang.org/api/googleapi"
)

func makeTextResponse (message string) *chat.Message {
	return &chat.Message {
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
		Text:            message,
		Thread:          nil,
		ServerResponse:  googleapi.ServerResponse{},
		ForceSendFields: nil,
		NullFields:      nil,
	}
}