package service

import (
	"github.com/gin-gonic/gin"
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

		_, exist := context.Repositories.UserRepository().GetByUserName(user.UserName)

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
