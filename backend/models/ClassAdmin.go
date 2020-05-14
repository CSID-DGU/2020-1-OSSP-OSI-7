package models

type ClassAdmin struct {
	ClassAdminId int64 `db:"class_admin_id" json:"class_admin_id"`
	ClassId int64 `db:"class_id" json:"class_id"`
	UserId int64 `db:"user_id" json:"user_id"`
}