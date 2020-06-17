package repository

import (
	"oss/dto"
	"oss/models"
)

type ClassQuizSetRepository interface {
	GetClassQuizSetGetFormByClassQuizSetId(classQuizSetId int64) (*dto.ClassQuizSetGetForm, *models.AppError)
	GetByQuizSetIdAndClassCode(quizSetId int64, classCode string) (bool, *models.AppError)
	DeleteQuizSetIdAndClassCode(quizSetId int64, classCode string) (*models.AppError)
	Create(quizSet models.ClassQuizSet) (*models.AppError)
	Delete(quizSetId int64) (*models.AppError)
	Edit(quizSet *models.ClassQuizSet) (*models.AppError)
}

type SqlClassQuizSetRepository struct {
	*Repository
}

func (q *SqlClassQuizSetRepository) GetClassQuizSetGetFormByClassQuizSetId(classQuizSetId int64) (*dto.ClassQuizSetGetForm, *models.AppError) {
	var classQuizSetGetForm *dto.ClassQuizSetGetForm
	err := q.Master.SelectOne(&classQuizSetGetForm,
		`SELECT cqs.class_quiz_set_id, qs.quiz_set_name, u.username FROM class_quiz_set cqs 
				INNER JOIN quiz_set qs ON qs.quiz_set_id = cqs.quiz_set_id AND cqs.class_quiz_set_id = ? 
				INNER JOIN user u ON u.user_id = qs.user_id`, classQuizSetId)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET CLASS QUIZ SET", "class_quiz_set_repository.go")
	}
	return classQuizSetGetForm, nil
}

func (q *SqlClassQuizSetRepository) GetByQuizSetIdAndClassCode(quizSetId int64, classCode string) (bool, *models.AppError) {
	var classQuizSetResult *models.ClassQuizSet
	err := q.Master.SelectOne(&classQuizSetResult,`SELECT * FROM class_quiz_set cqs WHERE cqs.quiz_set_id = ? 
			  AND cqs.class_id = (SELECT c.class_id FROM class c WHERE c.class_code = ?)`,
			  quizSetId, classCode)

	// TODO
	// 위험한 부분, 해당되는 row 가 없는 것도 정상 동작이어야 하지만
	// 라이브러리에서 에러로 처리하기 때문에, 실제 DB 에러일수 있는 가능성에도 불구하고
	// err 가 있어도 nil 을 리턴해서 정상처럼(중복이 아닌 것으로) 간주한다.
	if err != nil {
		//return false, models.NewDatabaseAppError(err, "FAILED TO GET CLASS QUIZ SET", "class_quiz_set_repository.go")
		return false, nil
	}
	return true, nil
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

