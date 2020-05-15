package dto

type Class struct {
	ClassName string `db:"class_name" json:"class_name"`
	ClassCode string `db:"class_code" json:"class_code"`
}