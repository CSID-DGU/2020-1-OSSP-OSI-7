package repository

import (
	"oss/dto"
	"oss/models"
)

type QuizSetResultRepository interface {
	Get(classQuizSetResultId int64, userName string) (*models.QuizSetResult, *models.AppError)
	//GetByClassQuizSetAndUserName(classQuizSetResultId int64, userName string) (*models.QuizSetResult, *models.AppError)
	GetUserAllQuizSet(userName string) ([]*dto.GetQuizSetResult, *models.AppError)
	Create(quizSetResult *models.QuizSetResult) (int64, *models.AppError)
	Delete(quizSetResultId int64) (*models.AppError)
	Update(quizSetResult *models.QuizSetResult) (*models.AppError)
}

type SqlQuizSetResultRepository struct {
	*Repository
}

func (q *SqlQuizSetResultRepository) Get(classQuizSetResultId int64, userName string) (*models.QuizSetResult, *models.AppError) {
	var quizSetResult *models.QuizSetResult
	err := q.Master.SelectOne(&quizSetResult,
		`SELECT * FROM quiz_set_result qsr WHERE qsr.class_quiz_set_id = ? AND
				qsr.user_id = (SELECT u.user_id FROM user u WHERE u.username = ?)`,classQuizSetResultId, userName)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET QUIZ SET RESULT", "quiz_set_result_repository.go")
	}
	return quizSetResult, nil
}

func (q *SqlQuizSetResultRepository) GetUserAllQuizSet(userName string) ([]*dto.GetQuizSetResult, *models.AppError) {
	var quizSetResults []*dto.GetQuizSetResult
	_, err := q.Master.Select(&quizSetResults,
		`SELECT qs.quiz_set_name, c.class_name, c.class_code, qs.total_score, qsr.my_score
   			FROM quiz_set_result qsr INNER JOIN class c ON c.class_id = 
			(SELECT class_id FROM class_quiz_set cqs1 WHERE cqs1.class_quiz_set_id = qsr.class_quiz_set_id) 
			AND qsr.user_id = (SELECT u.user_id FROM user u WHERE u.username = ?)
			INNER JOIN class_quiz_set cqs ON cqs.class_quiz_set_id = qsr.class_quiz_set_id
			INNER JOIN quiz_set qs ON qs.quiz_set_id = cqs.quiz_set_id`, userName)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET QUIZ SET RESULT", "quiz_set_result_repository.go")
	}

	return quizSetResults, nil
}

func (q *SqlQuizSetResultRepository) Create(quizSetResult *models.QuizSetResult) (int64, *models.AppError) {
	result, err := q.Master.Exec(`INSERT INTO quiz_set_result (class_quiz_set_id, user_id, my_score) VALUES 
					(?, ?, ?)`, quizSetResult.ClassQuizSetId, quizSetResult.UserId, quizSetResult.MyScore)

	if err != nil {
		return -1, models.NewDatabaseAppError(err, "FAILED TO CREATE QUIZ SET RESULT", "quiz_set_result_repository.go")
	}

	id, err := result.LastInsertId()
	return id, nil
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
	//_, err := q.Master.Update(quizSet)
	_, err := q.Master.Exec(`UPDATE quiz_set_result 
								SET my_score = ?
								WHERE quiz_set_result_id = ?`,
								quizSet.MyScore, quizSet.QuizSetResultId)
	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO UPDATE QUIZ SET RESULT", "quiz_set_result_repository.go")
	}
	return nil
}

