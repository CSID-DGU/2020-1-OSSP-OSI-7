package api

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"log"
	"oss/models"
	"oss/web"
)

var (
	USER = false
	ADMIN = true
)

type login struct {
	Username string `form:"username" json:"username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

// User demo`
type User struct {
	UserName  string
	FirstName string
	LastName  string
}


var identityKey = "id"

func helloHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	user, _ := c.Get(identityKey)
	c.JSON(200, gin.H{
		"userID":   claims[identityKey],
		"userName": user.(*User).UserName,
		"text":     "Hello World.",
	})
}

var App *web.Context

func InitRouters(context *web.Context) {
	App = context
	authMiddleware, err := getAuthMiddleware()
	r := context.Engine

	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}

	r.POST("/login", authMiddleware.LoginHandler)

	r.NoRoute(authMiddleware.MiddlewareFunc(), func(c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		log.Printf("NoRoute claims: %#v\n", claims)
		c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
	})

	r.POST("/foo", func(c *gin.Context) {
		var user models.User = models.User{
			1234,
			"hello",
			"world",
			"mypassword",
			"prof",
			true }

		c.Bind(&user)

		log.Println(user)

		_, err := context.Repositories.UserRepository().Create(user)

		if err != nil {
			println("오류 발생!", err.Message)
		}
	})

	auth := r.Group("/auth")
	// Refresh time can be longer than token timeout
	auth.GET("/refresh_token", authMiddleware.RefreshHandler)
	auth.Use(authMiddleware.MiddlewareFunc())

	auth.GET("/hello", helloHandler)

	public := r.Group("/public")
	public.GET("/good", func(c *gin.Context) {
		c.JSON(200, "good")
	})

}