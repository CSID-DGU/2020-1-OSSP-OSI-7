package main

import (
	_ "database/sql"
	_ "github.com/go-gorp/gorp"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/http"
	"os"
	"oss/api"
	"oss/web"
	_ "strconv"
)

func main() {
	port := os.Getenv("PORT")
	api.InitRouters(web.Context0)
	if port == "" {
		port = "8000"
	}

	if err := http.ListenAndServeTLS(":"+port, "server.crt", "server.key", web.Context0.Engine); err != nil {
			log.Fatal(err)
		}
}