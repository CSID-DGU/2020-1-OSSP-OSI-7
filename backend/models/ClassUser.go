package models

type ClassUser struct {
	ClassUserId int64 `db:"class_user_id" json:"class_user_id"`
	ClassId int64 `db:"class_id" json:"class_id"`
	UserId int64 `db:"user_id" json:"user_id"`
}