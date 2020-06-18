package web

import (
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"github.com/sirupsen/logrus"
	"os"
	"os/signal"
	"oss/repository"
	"syscall"
	"time"
)

var Context0 *Context = initContext()
var Logger *logrus.Logger = newLogger()

func newLogger() *logrus.Logger {
	logger := logrus.New()
	file, err := os.OpenFile("./logrus.log", os.O_CREATE | os.O_WRONLY | os.O_APPEND, 0666)
	if err == nil {
		logger.Out = file
	} else {
		logger.Info("Failed to log to file")
	}

	logger.SetFormatter(&logrus.TextFormatter{
		DisableColors: false,
		FullTimestamp: true,
	})
	logger.SetReportCaller(true)
	return logger
}

func cleanupHook() {

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, syscall.SIGTERM)
	signal.Notify(c, syscall.SIGKILL)
	go func() {
		<-c
		Context0.Redis.Close()
		os.Exit(0)
	}()
}

func newPool(server string) *redis.Pool {

	return &redis.Pool{

		MaxIdle:     3,
		IdleTimeout: 240 * time.Second,

		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", server)
			if err != nil {
				return nil, err
			}
			return c, err
		},

		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
}

func initContext () *Context {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	repo := repository.NewRepository()
	//redisHost := os.Getenv("REDIS_HOST")
	redisHost := ""
	if redisHost == "" {
		redisHost = "34.64.212.3:6379"
	}
	pool := newPool(redisHost)
	//cleanupHook()

	return &Context{
		r,
		pool,
		repo,
		repository.NewSqlRepositories(repo),
	}
}

type Context struct {
	Engine *gin.Engine
	Redis *redis.Pool
	Repository *repository.Repository
	Repositories repository.Repositories
}

