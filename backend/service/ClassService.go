package service

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"oss/models"
	"oss/web"
)

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
			println("error !", creatErr.Message)
		}

		context.Repositories.ClassAdminRepository().Create(user.UserId, new_class.ClassId)

		if err != nil {
			c.JSON(400, "bad request body")
			return
		}
	}
}

// 자신이 관리하고 있는 모든 강의들을 가져온다
func GetAllManagingClass (context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.Param("name")
		claims := jwt.ExtractClaims(c)

		result, err := context.Repositories.UserRepository().GetAllManagingClass(username)

		if err != nil {
			println(err.DetailedError)
		}

		for i := 0; i < len(result); i++ {
			println(result[i].ClassName)
		}

		print(claims)
	}
}
