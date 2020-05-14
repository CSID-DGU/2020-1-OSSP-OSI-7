package repository

import "oss/models"

type UserRepository interface {
	// 로그인 하는 계정으로 조회
	GetByUserName(username string) (*models.User, *models.AppError)
	// Primary key 로 조회
	GetByUserId() (*models.User, *models.AppError)
	Create(user models.User) (*models.User, *models.AppError)
}

type SqlUserRepository struct {
	*Repository
}

func (u *SqlUserRepository) GetByUserName(username string) (*models.User, *models.AppError) {
	var result *models.User
	err := u.Master.SelectOne(&result, "SELECT * FROM user WHERE username=?", username)
	if err != nil {
		return nil, models.NewDatabaseAppError(err, "user is not found", "user_repository.go")
	}
	return result, nil
}

func (u *SqlUserRepository) GetByUserId() (*models.User, *models.AppError) {
	return nil, nil
}

func (u *SqlUserRepository) Create(user models.User) (*models.User, *models.AppError) {

	err := u.Master.Insert(&user)

	if	err != nil {
		return nil, &models.AppError{Message: err.Error()}
	}

	return nil, nil
}
