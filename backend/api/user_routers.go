package api

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"oss/dto"
	"oss/models"
	"oss/web"
)

const (
	USER_NOT_EXISTS = "USER_NOT_EXISTS"
)

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
			println("cerror !", creatErr.Message)
		}
	}
}

// @tags User
// @Summary 유저 정보를 반환한다.
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param username path string true "유저 아이디"
// @Router /user/info/{userName} [GET]
// @Success 200 {object} dto.UserGetForm "유저 정보"
// @Failure 404 json string "user not exists "
func GetUserInfo (context *web.Context) gin.HandlerFunc {
 	return func (c *gin.Context) {
 		//var user *models.User
 		userName := c.Param("userName")
 		user, err := context.Repositories.UserRepository().GetByUserName(userName)
 		if err != nil {
 			c.JSON(404, USER_NOT_EXISTS)
 			return;
		}

		var professorFlag bool = false
 		if user.Authority == "PROFESSOR" {
			professorFlag = true
		}

		userGetForm := &dto.UserGetForm {
			UserName: user.UserName,
			StudentCode: user.StudentCode,
			Email: user.Email,
			NickName: user.NickName,
			Professor: professorFlag,
		}

		c.JSON(200, userGetForm)
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
