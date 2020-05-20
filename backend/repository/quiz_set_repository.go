package repository

import "oss/models"

type QuizSetRepository interface {
	Create(quizSet *models.QuizSet) (*models.AppError)
	Delete(quizSetId int64) (*models.AppError)
	Edit(quizSet *models.QuizSet) (*models.AppError)
}

type SqlQuizSetRepository struct {
	*Repository
}

func (q *SqlQuizSetRepository) Create(quizSet *models.QuizSet) (*models.AppError) {
	err := q.Master.Insert(&quizSet)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO CREATE QUIZ SET", "quiz_set_repository.go")
	}
	return nil
}

func (q *SqlQuizSetRepository) Delete(quizSetId int64) (*models.AppError) {
	var quizSet *models.QuizSet = &models.QuizSet {
		QuizSetId: quizSetId,
	}

	_, err := q.Master.Delete(&quizSet)

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
