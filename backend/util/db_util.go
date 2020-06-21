package util

import (
	"database/sql"
	"github.com/sirupsen/logrus"
	"oss/web"
)

func Rollback(tx *sql.Tx, funcName string) {
	err := tx.Rollback()
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"func_name" : funcName,
			"tx_err" : err,
		}).Error("FATAL Transaction Rollback Error")
	}
}

func CommitTransaction(tx *sql.Tx) {
	err := tx.Commit()
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"tx_err" : err,
		}).Error("FATAL Transaction Commit Error")
	}
}