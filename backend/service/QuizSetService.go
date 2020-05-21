package service

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"oss/dto"
	"oss/models"
	"oss/web"
	"strconv"
)

// @tags Quiz set
// @Summary 퀴즈셋을 생성한다
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetInfo JSON body dto.QuizSetCreateForm true "퀴즈셋 정보"
// @Router /quizset [POST]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string INVALID_PATH_PARAMETER
func CreateQuizSet(context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		var quizSetCreateForm *dto.QuizSetCreateForm
		var username string = claims["UserName"].(string)

		err := c.BindJSON(&quizSetCreateForm)

		if err != nil {
			c.JSON(400, INVALID_REQUEST_BODY)
			return
		}

		newQuizSet := &models.QuizSet {
			QuizSetName: quizSetCreateForm.QuizSetName,
			TotalScore: quizSetCreateForm.TotalScore,
		}
		quizSetId, createError := context.Repositories.QuizSetRepository().Create(username, newQuizSet)

		if createError != nil {
			c.JSON(500, RETRY)
			return
		}

		tx, err := context.Repository.Master.Db.Begin()
		if err != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}
		for _, quiz := range quizSetCreateForm.Quizes {
			modelQuiz := &models.Quiz{
				QuizTitle: quiz.QuizTitle,
				QuizSetId: quizSetId,
				QuizContent: quiz.QuizContent,
				QuizAnswer: quiz.QuizAnswer,
				QuizType: quiz.QuizType,
			}
			err := context.Repositories.QuizRepository().Create(modelQuiz)

			if err != nil {
				_ = tx.Rollback()
				c.JSON(500, INTERNAL_SERVER_ERROR)
				return
			}
		}
		_ = tx.Commit()

	}
}

// @tags Quiz set
// @Summary 퀴즈셋을 삭제한다
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizsetId path string true "퀴즈 셋 고유 아이디"
// @Router /quizset/{quizsetId} [DELETE]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string "INVALID_PATH_PARAMETER"
func DeleteQuizSet(context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		var username string = claims["UserName"].(string)
		quizsetId, err := strconv.ParseInt(c.Param("quizsetId"), 10, 64)

		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		users, getManagersErr := context.Repositories.QuizSetRepository().GetManagers(quizsetId)

		if getManagersErr != nil {
			c.JSON(401, UNAUTHORIZED)
			return
		}

		for _, user := range users {
			if user.UserName == username {
				err := context.Repositories.QuizSetRepository().Delete(quizsetId)
				if err != nil {
					c.JSON(500, INTERNAL_SERVER_ERROR)
					return
				}
				c.JSON(200, "ok")
				return
			}
		}

	}
}


