package repository

import "oss/models"

type QuizSetRepository interface {
	Create(userName string, quizSet *models.QuizSet) (int64, *models.AppError)
	Delete(quizSetId int64) (*models.AppError)
	Edit(quizSet *models.QuizSet) (*models.AppError)
	// 해당 퀴즈셋을 관리할 수 있는 모든 관리자를 조회한다.
	GetManagers (quizSetId int64) ([]*models.User, *models.AppError)
	GetQuizSetsById (quizSetId int64) (*models.QuizSet, *models.AppError)
	GetQuizSetsByUserName (username string) ([]models.QuizSet, *models.AppError)
	GetQuizSetsByClassCode (classCode string) ([]models.QuizSet, *models.AppError)
}

type SqlQuizSetRepository struct {
	*Repository
}

func (q *SqlQuizSetRepository) Create(userName string, quizSet *models.QuizSet) (int64, *models.AppError) {
	result, err := q.Master.Exec(
		`INSERT INTO quiz_set (user_id, quiz_set_name, total_score) 
			   VALUES ((SELECT u.user_id FROM user u WHERE u.username = ?),
					    ?, ?)`, userName, quizSet.QuizSetName, quizSet.TotalScore)

	if err != nil {
		return -1, models.NewDatabaseAppError(err, "FAILED TO CREATE QUIZ SET", "quiz_set_repository.go")
	}

	id, err := result.LastInsertId()

	if err != nil {
		return -1, models.NewDatabaseAppError(err, "FAILED TO CREATE QUIZ SET", "quiz_set_repository.go")
	}
	return id, nil
}

func (q *SqlQuizSetRepository) Delete(quizSetId int64) (*models.AppError) {

	_, err := q.Master.Exec("DELETE FROM quiz_set WHERE quiz_set_id = ?", quizSetId)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO DELETE QUIZ SET", "quiz_set_repository.go")
	}
	return nil
}

func (q *SqlQuizSetRepository) Edit(quizSet *models.QuizSet) (*models.AppError) {
	_, err := q.Master.Update(&quizSet)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO UPDATE QUIZ SET", "quiz_set_repository.go")
	}
	return nil
}

func (q *SqlQuizSetRepository) GetManagers (quizSetId int64) ([]*models.User, *models.AppError) {
	var users []*models.User
	_, err := q.Master.Select(&users,
		`SELECT username FROM user u
			   WHERE u.user_id = 
			   (SELECT qs.user_id FROM quiz_set qs WHERE quiz_set_id = ?)`, quizSetId)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO FETCH QUIZ SET AUTHORS", "quiz_set_repository.go")
	}
	return users, nil
}

func (q *SqlQuizSetRepository) GetQuizSetsById (quizSetId int64) (*models.QuizSet, *models.AppError) {
	var quizset *models.QuizSet
	err := q.Master.SelectOne(&quizset, "SELECT * FROM quiz_set qs WHERE qs.quiz_set_id = ?", quizSetId)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO FETCH QUIZ GET QUIZSET", "quiz_set_repository.go")
	}
	return quizset, nil
}

func (q *SqlQuizSetRepository) GetQuizSetsByUserName (username string) ([]models.QuizSet, *models.AppError) {
	var quizsets []models.QuizSet
	_, err := q.Master.Select(&quizsets,
		`SELECT * FROM quiz_set qs 
			   WHERE qs.user_id = (SELECT u.user_id FROM user u WHERE u.username = ?)`, username)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO FETCH QUIZ SET BY USER NAME", "quiz_set_repository.go")
	}
	return quizsets, nil
}

func (q *SqlQuizSetRepository) GetQuizSetsByClassCode (classCode string) ([]models.QuizSet, *models.AppError) {
	var quizsets []models.QuizSet

	_, err := q.Master.Select(&quizsets,
		`SELECT cqs.class_quiz_set_id, cqs.quiz_set_id, q.user_id, q.quiz_set_name, q.total_score FROM
			   class_quiz_set cqs INNER JOIN quiz_set q ON q.quiz_set_id = cqs.quiz_set_id
			   AND cqs.class_id = (SELECT c.class_id FROM class c WHERE c.class_code = ?)`, classCode)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO FETCH QUIZ SET BY USER NAME", "quiz_set_repository.go")
	}
	return quizsets, nil
}