package repository

import "oss/models"

type ClassUserRepository interface {
	Create(userName string, classCode string) (*models.AppError)
}

type SqlClassUserRepository struct {
	*Repository
}

func (c *SqlClassUserRepository) Create(userName string, classCode string) (*models.AppError) {
	_, err := c.Master.Exec(
		`INSERT INTO class_user (class_id, user_id) VALUES (
			(SELECT class_id FROM class c WHERE c.class_code = ?), 
			(SELECT user_id FROM user u WHERE u.username = ?))`,classCode, userName)

	if err != nil {
		return &models.AppError{Message: err.Error()}
	}

	return nil
}