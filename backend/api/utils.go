package api

import "github.com/gin-gonic/gin"

func CORSMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin")
		c.Header("Access-Control-Allow_Credentials", "true")
		c.Header("Access-Control-Allow-Origin", "https://34.64.101.170:8000")
		c.Header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT")

		c.Next()
	}
}