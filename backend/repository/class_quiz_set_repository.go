package repository

import "oss/models"

type ClassQuizSetRepository interface {
	Create(quizSet *models.ClassQuizSet) (*models.AppError)
	Delete(quizSetId int64) (*models.AppError)
	Edit(quizSet *models.ClassQuizSet) (*models.AppError)
}

type SqlClassQuizSetRepository struct {
	*Repository
}

func (q *SqlClassQuizSetRepository) Create(classQuizSet *models.ClassQuizSet) (*models.AppError) {
	err := q.Master.Insert(&classQuizSet)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO CREATE CLASS QUIZ SET", "class_quiz_set_repository.go")
	}
	return nil
}

func (q *SqlClassQuizSetRepository) Delete(classQuizSetId int64) (*models.AppError) {
	var classQuizSet *models.ClassQuizSet = &models.ClassQuizSet {
		ClassQuizSetId: classQuizSetId,
	}

	_, err := q.Master.Delete(&classQuizSet)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO DELETE CLASS QUIZ SET", "class_quiz_set_repository.go")
	}
	return nil
}

func (q *SqlClassQuizSetRepository) Edit(classQuizSet *models.ClassQuizSet) (*models.AppError) {
	_, err := q.Master.Update(&classQuizSet)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO UPDATE CLASS QUIZ SET", "class_quiz_set_repository.go")
	}
	return nil
}

