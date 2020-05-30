package repository

import "oss/models"

type UserRepository interface {
	// 로그인 하는 계정으로 유저 아이디를 받는다
	GetUserIdByUserName(userName string) (int64, *models.AppError)
	// 로그인 하는 계정으로 조회
	GetByUserName(username string) (*models.User, *models.AppError)
	// Primary key 로 조회
	GetByUserId(userId int64) (*models.User, *models.AppError)
	// 학번으로 조회
	GetByStudentCode(studentCode int64) (*models.User, *models.AppError)
	Create(user models.User) (*models.User, *models.AppError)
	GetAllManagingClass(username string) ([]*models.Class, *models.AppError)
	GetAllEnrolledClass(username string) ([]*models.Class, *models.AppError)
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

func (u *SqlUserRepository) GetByStudentCode(studentCode int64) (*models.User, *models.AppError) {
	var result *models.User
	err := u.Master.SelectOne(&result, "SELECT * FROM user WHERE student_code=?", studentCode)
	if err != nil {
		return nil, models.NewDatabaseAppError(err, "user is not found", "user_repository.go")
	}
	return result, nil
}

func (u *SqlUserRepository) GetByUserId(userId int64) (*models.User, *models.AppError) {
	var result *models.User
	err := u.Master.SelectOne(&result, `SELECT * FROM user WHERE user_id = ?`, userId)
	if err != nil {
		return nil, models.NewDatabaseAppError(err, "user is not found", "user_repository.go")
	}
	return result, nil
}

func (u *SqlUserRepository) GetUserIdByUserName(userName string) (int64, *models.AppError) {
	var userId int64
	err := u.Master.SelectOne(&userId, `SELECT u.user_id FROM user u WHERE username = ?`, userName)
	if err != nil {
		return -1, models.NewDatabaseAppError(err, "user is not found", "user_repository.go")
	}
	return userId, nil
}

func (u *SqlUserRepository) Create(user models.User) (*models.User, *models.AppError) {
	err := u.Master.Insert(&user)

	if	err != nil {
		return nil, &models.AppError{Message: err.Error()}
	}
	return nil, nil
}

func (u *SqlUserRepository) GetAllEnrolledClass(username string) ([]*models.Class, *models.AppError) {
	var class *models.Class

	result, err := u.Master.Select(&class,
		"SELECT c.class_id, c.class_name, c.class_code FROM class c WHERE c.class_id = ANY(SELECT cu.class_id FROM class_user cu WHERE cu.user_id = ANY(SELECT u.user_id from user u WHERE u.username = ?))", username);

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "no class matches", "class_admin_repository.go")
	}

	var classes []*models.Class
	for i := 0; i < len(result); i++ {
		if newClass, ok := result[i].(*models.Class); ok {
			classes = append(classes, newClass)
		}
	}
	return classes, nil
}

func (u *SqlUserRepository) GetAllManagingClass(username string) ([]*models.Class, *models.AppError) {
	var class *models.Class

	result, err := u.Master.Select(&class,
		"SELECT c.class_id, c.class_name, c.class_code FROM class c WHERE c.class_id = ANY(SELECT ca.class_id FROM class_admin ca WHERE ca.user_id = ANY(SELECT u.user_id from user u WHERE u.username = ?))", username);

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "no class matches", "class_admin_repository.go")
	}

	var classes []*models.Class
	for i := 0; i < len(result); i++ {
		if newClass, ok := result[i].(*models.Class); ok {
			classes = append(classes, newClass)
		}
	}
	return classes, nil
}
