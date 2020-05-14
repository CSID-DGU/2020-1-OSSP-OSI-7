package models

type AppError struct {
	Id string `json:"id"`
	Message string `json:"message"`
	DetailedError string `json:"detailed_error"`
	StatusCode int `json:"status_code,omitempty"`
	Where string `json:"-"`
}

func NewDatabaseAppError (err error, detail string, where string) *AppError {
	return &AppError{
		Id: "database_error",
		Message: err.Error(),
		DetailedError: detail,
		StatusCode: 500,
		Where: where,
	}
}