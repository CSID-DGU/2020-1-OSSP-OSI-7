package service

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"oss/dto"
	"oss/models"
	"oss/web"
)

// @tags User
// @Summary 로그인
// @Description
// @name get-string-by-int
// @Param Login JSON body dto.Login true "로그인 정보"
// @Router /user/login [POST]
// @Success 200  {string} string "OK"
// @Failure 404  {string} string "USER_NOT_EXIST"
func Login (context *web.Context, middleware *jwt.GinJWTMiddleware )  gin.HandlerFunc {
	return middleware.LoginHandler
}

// @tags Users
// @Summary 유저 로그인 아이디 중복 확인
// @Description
// @name get-string-by-int
// @Param username path string true "확인 하려는  로그인 아이디"
// @Router /users/{username} [GET]
// @Success 200  {string} string "OK"
// @Failure 404  {string} string "USER_NOT_EXIST"
func GetUserByUserName (context *web.Context)  gin.HandlerFunc {
	return func (c *gin.Context) {

		username := c.Param("name")

		exist, _ := context.Repositories.UserRepository().GetByUserName(username)

		if exist != nil {
			c.JSON(200, "the user exists")
		} else {
			c.JSON(400, "the user not exists")
		}
	}
}

// @tags User
// @Summary 회원가입
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param REQUEST JSON body dto.User true "유저정보"
// @Router /user/register [POST]
// @Success 200 {string} string "ok"
// @Failure 400 json string "bad request"
func Register (context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		var user models.User
		err := c.BindJSON(&user)

		if err != nil {
			c.JSON(400, "bad request body")
			return
		}

		exist, _  := context.Repositories.UserRepository().GetByUserName(user.UserName)

		if exist != nil {
			c.JSON(400, "the username exists")
			return
		}

		_, creatErr := context.Repositories.UserRepository().Create(user)

		if creatErr != nil {
			println("error !", creatErr.Message)
		}
	}
}

// @tags User
// @Summary 수강하고 있는 강의목록 조회
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param username path string true "유저 아이디"
// @Router /user/classes/enrolled/{userName} [GET]
// @Success 200 {array} dto.Class "강의목록(배열)"
// @Failure 400 json string "bad request"
func GetAllEnrolledClass(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		//claims := jwt.ExtractClaims(c)
		//userName := claims["UserName"].(string)
		userName := c.Param("userName")
		result, err := context.Repositories.UserRepository().GetAllEnrolledClass(userName)

		var compacted []*dto.Class

		for i := 0; i < len(result); i++ {
			dtoClass := &dto.Class{
				result[i].ClassName,
				result[i].ClassCode,
			}
			compacted = append(compacted, dtoClass)
		}
		if err != nil {
			c.JSON(200, "")
		} else {
			c.JSON(200, compacted)
		}
	}
}

// @tags User
// @Summary 유저가 만든 모든 퀴즈셋 조회
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param username path string true "유저 로그인 아이디"
// @Router /user/quizset/{username} [GET]
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