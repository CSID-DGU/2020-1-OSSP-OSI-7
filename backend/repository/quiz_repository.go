package repository

import "oss/models"

type QuizRepository interface {
	Create(quiz *models.Quiz) (*models.AppError)
	Delete(quizId int64) (*models.AppError)
	Edit(quiz *models.Quiz) (*models.AppError)
}

type SqlQuizRepository struct {
	*Repository
}

func (q *SqlQuizRepository) Create(quiz *models.Quiz) (*models.AppError) {
	err := q.Master.Insert(&quiz)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO CREATE QUIZ", "quiz_repository.go")
	}
	return nil
}

func (q *SqlQuizRepository) Delete(quizId int64) (*models.AppError) {
	var quiz *models.Quiz = &models.Quiz {
		QuizId: quizId,
	}

	_, err := q.Master.Delete(&quiz)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO DELETE QUIZ", "quiz_repository.go")
	}
	return nil
}

func (q *SqlQuizRepository) Edit(quiz *models.Quiz) (*models.AppError) {
	_, err := q.Master.Update(&quiz)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO UPDATE QUIZ", "quiz_repository.go")
	}
	return nil
}