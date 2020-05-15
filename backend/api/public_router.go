package api

import (
	"oss/service"
	"oss/web"
)

func initPublicRouters(context *web.Context) {
	context.Engine.POST("/register", service.Register(context))

	//context.Engine.POST("/", service.CreateClass(context))
}