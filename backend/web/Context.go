package web

import (
	"github.com/gin-gonic/gin"
	"oss/repository"
)

var Context0 *Context = initContext()

func initContext () *Context {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	repo := repository.NewRepository()
	return &Context{
		r,
		repo,
		repository.NewSqlRepositories(repo),
	}
}

type Context struct {
	Engine *gin.Engine
	Repository *repository.Repository
	Repositories repository.Repositories
}

