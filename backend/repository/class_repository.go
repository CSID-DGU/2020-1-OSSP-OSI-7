package repository

import "oss/models"

type ClassRepository interface {
	GetByClassCode(classCode string) (*models.Class, *models.AppError)
	Create(class models.Class) (*models.Class, *models.AppError)
}

type SqlClassRepository struct {
	*Repository
}

func (c *SqlClassRepository) GetByClassCode(classCode string) (*models.Class, *models.AppError) {
	var class *models.Class
	err := c.Master.SelectOne(&class, "SELECT * FROM class WHERE class_code = ?", classCode)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "class not exists", "class_repository")
	}
	return class, nil
}

func (c *SqlClassRepository) Create(class models.Class) (*models.Class, *models.AppError) {

	err := c.Master.Insert(&class)

	if err != nil {
		return nil, &models.AppError{Message: err.Error()}
	}

	return nil, nil
}
