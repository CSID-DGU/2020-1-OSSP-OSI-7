package dto

type Class struct {
	ClassName string `db:"class_name" json:"class_name" example:"CSE-1234"`
	ClassCode string `db:"class_code" json:"class_code" example:"형식언어"`
}