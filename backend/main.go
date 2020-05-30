package main

import (
	"github.com/sirupsen/logrus"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"log"
	"net/http"
	"os"
	"oss/api"
	"oss/docs"
	"oss/web"
	_ "strconv"
)

func main() {
	port := os.Getenv("PORT")
	api.InitRouters(web.Context0)
	if port == "" {
		port = "8000"
	}


	docs.SwaggerInfo.Title = "DQUIZ SWAAGER API"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "https://34.64.101.170"
//	url := ginSwagger.URL("http://localhost:8000/swagger/doc.json")
	web.Context0.Engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	web.Logger.WithFields(logrus.Fields{
		"event" : "event",
	}).Info("Failed to send log")
	if err := http.ListenAndServeTLS(":"+port, "server.crt", "server.key", web.Context0.Engine); err != nil {
			log.Fatal(err)
		}
}