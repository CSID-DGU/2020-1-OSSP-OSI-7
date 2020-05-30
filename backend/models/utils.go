package models

import (
	"github.com/sirupsen/logrus"
	"oss/cerror"
	"oss/web"
	"runtime"
)

type AppError struct {
	Id string `json:"id"`
	Message string `json:"message"`
	DetailedError string `json:"detailed_error"`
	StatusCode int `json:"status_code,omitempty"`
	Where string `json:"-"`
}

func NewDatabaseAppError (err error, detail string, where string) *AppError {

	web.Logger.WithFields(logrus.Fields{
		"err" : err,
	}).Fatal(cerror.DQUIZ_DB_OPERATION_ERROR)

	return &AppError{
		Id: "database_error",
		Message: err.Error(),
		DetailedError: detail,
		StatusCode: 500,
		Where: where,
	}
}

func NewAppError (err error, detail string, where string) *AppError {

	var errMsg string = ""
	if err != nil {
		errMsg = err.Error()
	}

	return &AppError{
		Id: "app cerror",
		Message: errMsg,
		DetailedError: detail,
		StatusCode: 500,
		Where: where,
	}
}


func GetFuncName () string {
	pc, _, _, _ := runtime.Caller(1)
	return runtime.FuncForPC(pc).Name()
}