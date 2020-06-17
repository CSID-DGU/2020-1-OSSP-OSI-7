package api

import "github.com/gin-gonic/gin"

func CORSMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin")
		c.Header("Access-Control-Allow-Origin", "*")
		//c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func NewDetailedInternalServerError(detail string) string {
	return INTERNAL_SERVER_ERROR + " => " + detail
}