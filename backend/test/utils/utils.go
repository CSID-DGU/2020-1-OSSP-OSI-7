package utils

import (
	"github.com/gomodule/redigo/redis"
	"oss/web"
)

func CloseRedisConnection (conn *redis.Conn) {
		err := (*conn).Close()
		if err != nil {
			web.Logger.Error("Failed to close Redis connection")
		}
}