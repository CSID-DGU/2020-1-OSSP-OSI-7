package api

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"log"
	"oss/service"
	"oss/web"
)

var (
	USER = false
	ADMIN = true
)



// User demo`

var identityKey = "UserName"

func helloHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"text":     "Hello World.",
	})
}

var App *web.Context

func InitRouters(context *web.Context) {
	App = context
	initPublicRouters(context)
	authMiddleware, err := getAuthMiddleware()
	classMiddleware, err := getClassAuthMiddleware()

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

	})

	class := r.Group("/class")
	class.Use(classMiddleware.MiddlewareFunc())
	class.GET("/", func (c *gin.Context) {
		c.JSON(200, gin.H{
			"text":     "Hello World.",
		})
	})
	class.POST("/", service.CreateClass(context))
	class.GET("/user/:username", service.GetAllManagingClass(context))

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