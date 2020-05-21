package service

import (
	"github.com/gin-gonic/gin"
	"oss/dto"
	"oss/models"
	"oss/web"
	"strconv"
)

// @tags Quiz set
// @Summary 퀴즈셋에 퀴즈를 추가한다.
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetId path string true "퀴즈를 추가하려는 퀴즈셋의 아이디"
// @Param quizInfo JSON body dto.QuizCreateForm true "퀴즈 정보"
// @Router /quizset/{quizsetId}/quiz [POST]
// @Success 200 {string} string "성공"
// @Failure 400 {string} string "요청이 올바르지 않습니다."
func AddQuiz(context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		quizSetId, err := strconv.ParseInt(c.Param("quizsetId"), 10, 64)

		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
		}

		var quizCreateForm *dto.QuizCreateForm

		bindError := c.BindJSON(&quizCreateForm)

		if bindError != nil {
			c.JSON(400, INVALID_REQUEST_HEADER)
			return
		}

		var newQuiz *models.Quiz = &models.Quiz{
			QuizSetId: quizSetId,
			QuizTitle: quizCreateForm.QuizTitle,
			QuizType: quizCreateForm.QuizType,
			QuizContent: quizCreateForm.QuizContent,
			QuizAnswer: quizCreateForm.QuizAnswer,
		}
		quizCreateError := context.Repositories.QuizRepository().Create(newQuiz)

		if quizCreateError != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}
		c.JSON(200, "ok")
		return
	}
}

// @tags Quiz set
// @Summary 퀴즈셋에 있는 퀴즈를 삭제한다
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetId path string true "퀴즈를 삭제 하려는 퀴즈셋의 아이디"
// @Param quizId path string true "삭제 하려는 퀴즈의 아이디"
// @Router /quizset/{quizSetId}/quiz/{quizId} [DELETE]
// @Success 200 {string} string "성공"
// @Failure 400 {string} string "요청이 올바르지 않습니다."
func DeleteQuizFromQuizSet(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		var parseIntErr error
		var err *models.AppError
		var quizId int64
		var quizSetId int64
		quizSetId, parseIntErr = strconv.ParseInt(c.Param("quizsetId"), 10, 64)
		quizId, parseIntErr = strconv.ParseInt(c.Param("quizId"), 10, 64)

		if parseIntErr != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		_, err = context.Repositories.QuizSetRepository().GetQuizSetsById(quizSetId)
		err = context.Repositories.QuizRepository().Delete(quizId)

		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
		}
	}
}

// @tags Quiz set
// @Summary 유저의 퀴즈셋에 있는 퀴즈를 강의의 퀴즈셋으로 가져온다
// @Description 퀴즈 셋 고유 아이디와 학수번호를 받아서 클래스의 퀴즈셋 목록에 추가한다.
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetId path string true "클래스에 불러오려는 퀴즈셋의 아이디"
// @Param classCode path string true "퀴즈를 추가하려는 강의의 학수번호"
// @Router /quizset/{quizSetId}/class/{classCode} [POST]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string "요청이 올바르지 않습니다."
// @Failure 400 {string} string "CLASS_QUIZ_SET_ALREADY_EXISTS"
func LoadQuizSetToClass(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		var err *models.AppError
		var parseIntErr error
		var quizSetId int64
		var classCode string
		classCode = c.Param("classCode")
		quizSetId, parseIntErr = strconv.ParseInt(c.Param("quizsetId"), 10, 64)

		if parseIntErr != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		_, err = context.Repositories.QuizSetRepository().GetQuizSetsById(quizSetId)
		class, err := context.Repositories.ClassRepository().GetByClassCode(classCode)

		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		result, err := context.Repositories.ClassQuizSetRepository().GetByQuizSetIdAndClassCode(quizSetId, classCode)

		if result == nil {
			if err == nil {
				c.JSON(400, "CLASS_QUIZ_SET_ALREADY_EXISTS")
				return
			} else {
				c.JSON(500, INTERNAL_SERVER_ERROR)
				return
			}
		}

		classQuizSet := models.ClassQuizSet {
			QuizSetId: quizSetId,
			ClassId: class.ClassId,
		}

		err = context.Repositories.ClassQuizSetRepository().Create(classQuizSet)

		if err != nil {
			c.JSON(500, INVALID_PATH_PARAMETER)
			return
		}
	}
}

// @tags Quiz set
// @Summary 클래스에 있는 퀴즈셋을 삭제한다
// @Description 퀴즈 셋 고유 아이디와 학수번호를 이용해서 클래스에서 퀴즈셋을 삭제한다.
// @Description 원본 퀴즈 셋은 삭제되지 않는다.
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetId path string true "강의 에서 삭제 하려는 퀴즈셋의 아이디"
// @Param classCode path string true "강의의 학수번호"
// @Router /quizset/{quizSetId}/class/{classCode} [DELETE]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string INVALID_PATH_PARAMETER
// @Failure 400 {string} string "CLASS_QUIZ_SET_NOT_EXISTS"
// @Failure 500 {string} string INTERNAL_SERVER_ERROR
func DeleteQuizSetFromClass(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		var err *models.AppError
		var parseIntErr error
		var quizSetId int64
		var classCode string
		classCode = c.Param("classCode")
		quizSetId, parseIntErr = strconv.ParseInt(c.Param("quizsetId"), 10, 64)

		if parseIntErr != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		_, err = context.Repositories.ClassQuizSetRepository().GetByQuizSetIdAndClassCode(quizSetId, classCode)

		// Class quiz set 이 존재하지 않으면
		if err != nil {
			c.JSON(400, "CLASS_QUIZ_SET_NOT_EXISTS")
			return
		}

		// TODO cascading 처리 문제는?
		err = context.Repositories.ClassQuizSetRepository().DeleteQuizSetIdAndClassCode(quizSetId, classCode)

		if err != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}
	}
}