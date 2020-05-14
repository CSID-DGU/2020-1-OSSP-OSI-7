package repository

import "oss/models"

type ClassAdminRepository interface {
	Create(userId int64, classId int64) (*models.AppError)
	GetByClass(class *models.Class) ([]*models.ClassAdmin, *models.AppError)
//	GetByAdmin(username string) (*models.ClassAdmin, *models.AppError)
}
type SqlClassAdminRepository struct {
	*Repository
}

func (c *SqlClassAdminRepository) Create(userId int64, classId int64) (*models.AppError) {
		var classAdmin models.ClassAdmin = models.ClassAdmin{
			ClassId: classId,
			UserId: userId,
		}
		err := c.Master.Insert(&classAdmin)

		if err != nil {
			return models.NewDatabaseAppError(err, "classAdmin already exists", "class_admin_repository")
		}
		return nil
}

func (c *SqlClassAdminRepository) GetByClass(class *models.Class) ([]*models.ClassAdmin, *models.AppError) {
	var admins *models.ClassAdmin
	result, err := c.Master.Select(&admins, "SELECT * FROM class_admin WHERE class_id = ?", class.ClassId)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "no class admin matches", "class_admin_repository.go")
	}

	var datas []*models.ClassAdmin
	for i := 0; i < len(result); i++ {
		if data, ok := result[i].(*models.ClassAdmin); ok {
			datas = append(datas, data)
		}
	}
	return datas, nil
}

