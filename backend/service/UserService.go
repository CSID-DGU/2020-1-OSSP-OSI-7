package service

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"oss/dto"
	"oss/models"
	"oss/web"
)

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

func GetAllEnrolledClass(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		userName := claims["UserName"].(string)

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
