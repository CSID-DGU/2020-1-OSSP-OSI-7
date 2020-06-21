package api

import (
	"github.com/gin-gonic/gin"
	"oss/dto"
	"oss/web"
)

// @tags Quiz set
// @Summary 유저가 만든 모든 퀴즈셋 조회
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param username path string true "유저 로그인 아이디"
// @Router /quizsets/users/{username} [GET]
// @Success 200 {array} dto.QuizSetGetForm "퀴즈셋목록(배열)"
// @Failure 400 {string} string "bad request"
func GetUserQuizSet (context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		var result []dto.QuizSetGetForm
		username := c.Param("username")

		quizSets, err := context.Repositories.QuizSetRepository().GetQuizSetsByUserName(username)

		if err != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}

		for _, quizSet := range quizSets {
			quizzes, err := context.Repositories.QuizRepository().GetQuizzesByQuizSetId(quizSet.QuizSetId)
			if err != nil {
				c.JSON(500, INTERNAL_SERVER_ERROR)
				return
			}

			var quizzesResult []dto.QuizGetForm
			for _, quiz := range quizzes {
				quizGetForm := dto.QuizGetForm {
					QuizId: quiz.QuizId,
					QuizTitle: quiz.QuizTitle,
					QuizContent: quiz.QuizContent,
					QuizAnswer: quiz.QuizAnswer,
					QuizType: quiz.QuizType,
				}
				quizzesResult = append(quizzesResult, quizGetForm)
			}
			
			quizSetResult := dto.QuizSetGetForm{
				QuizSetId: quizSet.QuizSetId,
				QuizSetName: quizSet.QuizSetName,
				QuizSetAuthorUserName: username,
				Quizzes: quizzesResult,

			}
			result = append(result, quizSetResult)
		}

		c.JSON(200, result)
	}
}
