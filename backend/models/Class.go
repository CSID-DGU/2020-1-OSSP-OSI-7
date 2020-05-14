package models

type Class struct {
	ClassId int64 `db:"class_id" json:"class_id"`
	ClassName string `db:"class_name" json:"class_name"`
	ClassCode string `db:"class_code" json:"class_code"`
}