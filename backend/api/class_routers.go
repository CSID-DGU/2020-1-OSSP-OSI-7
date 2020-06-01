package api

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"oss/models"
	"oss/web"
)

// @tags Class
// @Summary 강의개설
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param REQUEST JSON body dto.Class true "강의정보"
// @Router /class [post]
// @Success 200 {string} string "ok"
// @Failure 400 json string "강의 생성에 실패 했습니다."
func CreateClass (context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		var class models.Class
		err := c.BindJSON(&class)

		user, userError := context.Repositories.UserRepository().GetByUserName(claims["UserName"].(string))

		if userError != nil {
			println(userError.DetailedError, " occurred")
			return
		}
		exist_class, _:= context.Repositories.ClassRepository().GetByClassCode(class.ClassCode)

		if exist_class != nil {
			c.JSON(400, "the class code exist")
			return
		}
		_, creatErr := context.Repositories.ClassRepository().Create(class)
		new_class, _ := context.Repositories.ClassRepository().GetByClassCode(class.ClassCode)

		if creatErr != nil {
			println("cerror !", creatErr.Message)
		}

		context.Repositories.ClassAdminRepository().Create(user.UserId, new_class.ClassId)

		if err != nil {
			c.JSON(400, "bad request body")
			return
		}
	}
}

// @tags Class
// @Summary 수강신청
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param classCode path string true "학수번호"
// @Router /class/enroll/{classCode} [post]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string "학수번호가 유효하지 않습니다."
// @Failure 404 {string} string "강의가 존재하지 않습니다.."
// 수강신청 (단 승낙과정 없이 즉시 반영)
func JoinClass (context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		userName := claims["UserName"].(string)
		classCode := c.Param("classcode")

		if classCode == "" {
			c.JSON(400, "class code is invalid")
			return
		}

		_, getClassError := context.Repositories.ClassRepository().GetByClassCode(classCode)

		if getClassError != nil {
			c.JSON(404, "class not exists")
			return
		}

		context.Repositories.ClassUserRepository().Create(userName, classCode)

	}
}

// @tags Class
// @Summary 유저가 관리하고 있는 모든 강의들을 가져온다
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param userName path string true "유저 아이디"
// @Router /user/classes/managing/{userName} [get]
// @Success 200 {array} dto.Class "강의목록(배열)"
// @Failure 400 {string} string "학수번호가 유효하지 않습니다."
// @Failure 404 {string} string "강의가 존재하지 않습니다.."
func GetAllManagingClass (context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		//claims := jwt.ExtractClaims(c)
		//userName := claims["UserName"].(string)
		userName := c.Param("userName")
		result, err := context.Repositories.UserRepository().GetAllManagingClass(userName)

		if err != nil {
			println(err.DetailedError)
			c.JSON(400, err.Message)
			return
		}

		for i := 0; i < len(result); i++ {
			println(result[i].ClassName)
		}

		c.JSON(200, result)
	}
}
