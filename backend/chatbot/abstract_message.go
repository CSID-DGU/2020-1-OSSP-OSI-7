package chatbot

import "oss/models"

type AbstractMessage interface {
	Process(email string) (interface{}, *models.AppError)
}


