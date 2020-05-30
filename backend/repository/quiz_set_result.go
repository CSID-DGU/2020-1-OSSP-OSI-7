package repository

import "oss/models"

type QuizSetResultRepository interface {
	Get(classQuizSetResultId int64, userName string) (*models.QuizSetResult, *models.AppError)
	Create(quizSetResult *models.QuizSetResult) (*models.AppError)
	Delete(quizSetResultId int64) (*models.AppError)
	Update(quizSetResult *models.QuizSetResult) (*models.AppError)
}

type SqlQuizSetResultRepository struct {
	*Repository
}

func (q *SqlQuizSetResultRepository) Get(classQuizSetResultId int64, userName string) (*models.QuizSetResult, *models.AppError) {
	var quizSetResult *models.QuizSetResult
	err := q.Master.SelectOne(&quizSetResult,
		`SELECT * FROM quiz_set_result WHERE class_quiz_set_id = ?,
				user_id = (SELECT u.user_id FROM user u WHERE u.username = ?)`,classQuizSetResultId, userName)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET QUIZ SET RESULT", "quiz_set_result_repository.go")
	}
	return quizSetResult, nil
}

func (q *SqlQuizSetResultRepository) Create(quizSetResult *models.QuizSetResult) (*models.AppError) {
	err := q.Master.Insert(&quizSetResult)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO CREATE QUIZ SET RESULT", "quiz_set_result_repository.go")
	}
	return nil
}

func (q *SqlQuizSetResultRepository) Delete(quizSetResultId int64) (*models.AppError) {
	var quizSetResult *models.QuizSetResult = &models.QuizSetResult {
		QuizSetResultId: quizSetResultId,
	}

	_, err := q.Master.Delete(&quizSetResult)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO DELETE QUIZ SET RESULT", "quiz_set_result_repository.go")
	}
	return nil
}

func (q *SqlQuizSetResultRepository) Update(quizSet *models.QuizSetResult) (*models.AppError) {
	_, err := q.Master.Update(&quizSet)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO UPDATE QUIZ SET RESULT", "quiz_set_result_repository.go")
	}
	return nil
}

