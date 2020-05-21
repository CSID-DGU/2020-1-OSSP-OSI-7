package api

import (
	"github.com/gin-gonic/gin"
	"oss/web"
)

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
