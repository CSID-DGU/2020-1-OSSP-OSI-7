package service

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"oss/models"
	"oss/web"
)

func CreateQuiz(context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		var quiz *models.Quiz
		var username string = claims["UserName"].(string)

		_, err := context.Repositories.ClassAdminRepository().GetByAdmin(username)

		bindError := c.BindJSON(&quiz)

		if bindError != nil {
			c.JSON(400, INVALID_REQUEST_HEADER)
			return
		}

		if err != nil {
			c.JSON(401, UNAUTHORIZED)
			return
		}

		quizCreateError := context.Repositories.QuizRepository().Create(quiz)

		if quizCreateError != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}

	}
}
