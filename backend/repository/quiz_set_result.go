package repository

import "oss/models"

type QuizSetResultRepository interface {
	Create(quizSetResult *models.QuizSetResult) (*models.AppError)
	Delete(quizSetResultId int64) (*models.AppError)
	Edit(quizSetResult *models.QuizSetResult) (*models.AppError)
}

type SqlQuizSetResultRepository struct {
	*Repository
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

func (q *SqlQuizSetResultRepository) Edit(quizSet *models.QuizSetResult) (*models.AppError) {
	_, err := q.Master.Update(&quizSet)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO UPDATE QUIZ SET RESULT", "quiz_set_result_repository.go")
	}
	return nil
}

