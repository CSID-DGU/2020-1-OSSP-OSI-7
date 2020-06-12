package repository

import (
	"oss/dto"
	"oss/models"
)

type QuizRepository interface {
	GetQuizByQuizId(quizId int64) (*models.Quiz, *models.AppError)
	GetQuizzesByQuizSetId(quizSetId int64) ([]models.Quiz, *models.AppError)
	GetQuizzesByClassQuizSetId(classQuizSetId int64) ([]models.Quiz, *models.AppError)
	GetQuizAnswerWithScoreByQuizId(quizId int64) (*dto.QuizAnswerWithScore, *models.AppError)
	Create(quiz *models.Quiz) (*models.AppError)
	Delete(quizId int64) (*models.AppError)
	Edit(quiz *models.Quiz) (*models.AppError)
}

type SqlQuizRepository struct {
	*Repository
}

func (q *SqlQuizRepository) GetQuizByQuizId(quizId int64) (*models.Quiz, *models.AppError) {
	var quiz *models.Quiz
	err := q.Master.SelectOne(&quiz,
		`SELECT * FROM quiz q WHERE q.quiz_id = ?`, quizId)
	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET QUIZ", "quiz_repository.go")
	}
	return quiz, nil
}

func (q *SqlQuizRepository) GetQuizAnswerWithScoreByQuizId(quizId int64) (*dto.QuizAnswerWithScore, *models.AppError) {
	var quiz *models.Quiz
	var quizAnswerWithScore *dto.QuizAnswerWithScore
	err := q.Master.SelectOne(&quiz,
		`SELECT * FROM quiz q WHERE q.quiz_id = ?`,quizId)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET QUIZ", "quiz_repository.go")
	}
	quizAnswerWithScore = &dto.QuizAnswerWithScore {
		QuizAnswer: quiz.QuizAnswer,
		QuizScore: quiz.QuizScore,
	}
	return quizAnswerWithScore, nil
}

func (q *SqlQuizRepository) GetQuizzesByQuizSetId(quizSetId int64) ([]models.Quiz, *models.AppError) {
	var quizzes []models.Quiz
	_, err := q.Master.Select(&quizzes,
		`SELECT * FROM quiz q WHERE q.quiz_set_id = ?`,quizSetId)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET QUIZ", "quiz_repository.go")
	}
	return quizzes, nil
}

func (q *SqlQuizRepository) GetQuizzesByClassQuizSetId(classQuizSetId int64) ([]models.Quiz, *models.AppError) {
	var quizzes []models.Quiz
	_, err := q.Master.Select(&quizzes,
		`SELECT q.quiz_id, q.quiz_set_id, q.quiz_title, q.quiz_content, q.quiz_type, q.quiz_score, q.quiz_answer 
				FROM quiz q INNER JOIN class_quiz_set cqs ON
				cqs.quiz_set_id = q.quiz_set_id AND cqs.class_quiz_set_id = ?`,classQuizSetId)

	if err != nil {
		return nil, models.NewDatabaseAppError(err, "FAILED TO GET QUIZ", "quiz_repository.go")
	}
	return quizzes, nil
}

func (q *SqlQuizRepository) Create(quiz *models.Quiz) (*models.AppError) {
	err := q.Master.Insert(quiz)

	if err != nil {
		return models.NewDatabaseAppError(err, "FAILED TO CREATE QUIZ", "quiz_repository.go")
	}
	return nil
}

func (q *SqlQuizRepository) Delete(quizId int64) (*models.AppError) {

	_, err := q.Master.Exec("DELETE FROM quiz WHERE quiz_id = ?", quizId)

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