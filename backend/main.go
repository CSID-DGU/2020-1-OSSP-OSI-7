package main

import (
	_ "database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/go-gorp/gorp"
 	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/http"
	"os"
	"oss/api"
	"oss/repository"
	"oss/web"
)

type app struct {
	engine *gin.Engine
	repository *repository.Repository
	repositories repository.Repositories
}

var context *web.Context = web.InitContext()

func main() {
	port := os.Getenv("PORT")
	api.InitRouters(context)
	if port == "" {
		port = "8000"
	}

	if err := http.ListenAndServeTLS(":"+port, "server.crt", "server.key", context.Engine); err != nil {
		log.Fatal(err)
	}
}
