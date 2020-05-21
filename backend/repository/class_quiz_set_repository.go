package repository

import "oss/models"

type ClassQuizSetRepository interface {
	GetByQuizSetIdAndClassCode(quizSetId int64, classCode string) (*models.ClassQuizSet, *models.AppError)
	DeleteQuizSetIdAndClassCode(quizSetId int64, classCode string) (*models.AppError)
	Create(quizSet models.ClassQuizSet) (*models.AppError)
	Delete(quizSetId int64) (*models.AppError)
	Edit(quizSet *models.ClassQuizSet) (*models.AppError)
}

type SqlClassQuizSetRepository struct {
	*Repository
}

func (q *SqlClassQuizSetRepository) GetByQuizSetIdAndClassCode(quizSetId int64, classCode string) (*models.ClassQuizSet, *models.AppError) {
	var classQuizSet *models.ClassQuizSet
	err := q.Master.SelectOne(&classQuizSet,
		`SELECT * FROM class_quiz_set cqs WHERE cqs.quiz_set_id = ? 
			  AND cqs.class_id = (SELECT c.class_id FROM class c WHERE c.class_code = ?)`,
			  quizSetId, classCode)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET CLASS QUIZ SET", "class_quiz_set_repository.go")
	}
	return nil, nil
}

func (q *SqlClassQuizSetRepository) Create(classQuizSet models.ClassQuizSet) (*models.AppError) {
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

func (q *SqlClassQuizSetRepository) DeleteQuizSetIdAndClassCode(quizSetId int64, classCode string) (*models.AppError) {

	_, err := q.Master.Exec(`
			DELETE FROM class_quiz_set 	
			WHERE quiz_set_id = ? 
			AND class_id = (SELECT c.class_id FROM class c WHERE c.class_code = ?)`,
			quizSetId, classCode)

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

