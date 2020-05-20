package repository

import "oss/models"

type QuizResultRepository interface {
	Create(quizResult *models.QuizResult) (*models.AppError)
	Delete(quizResultId int64) (*models.AppError)
	Edit(quizResult *models.QuizResult) (*models.AppError)
}

type SqlQuizResultRepository struct {
	*Repository
}

func (q *SqlQuizResultRepository) Create(quizResult *models.QuizResult) (*models.AppError) {
	err := q.Master.Insert(&quizResult)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO CREATE QUIZ RESULT", "quiz_result_repository.go")
	}
	return nil

}

func (q *SqlQuizResultRepository) Delete(quizResultId int64) (*models.AppError) {
	var quiz *models.QuizResult = &models.QuizResult {
		QuizResultId: quizResultId,
	}

	_, err := q.Master.Delete(&quiz)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO DELETE QUIZ RESULT", "quiz_result_repository.go")
	}
	return nil
}

func (q *SqlQuizResultRepository) Edit(quizResult *models.QuizResult) (*models.AppError) {
	_, err := q.Master.Update(&quizResult)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO UPDATE QUIZ RESULT", "quiz_result_repository.go")
	}
	return nil
}