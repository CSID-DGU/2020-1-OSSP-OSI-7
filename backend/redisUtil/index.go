package redisUtil

import (
	"github.com/gomodule/redigo/redis"
	"github.com/sirupsen/logrus"
	"oss/cerror"
	"oss/models"
	"oss/web"
)

const (
	QUIZ_ANSWER_EXPIRE_TIME = 60 * 10
)

func RedisGet(conn *redis.Conn, key string) (string, *models.AppError) {
	result, err := redis.String((*conn).Do("GET", key))
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"err" : err,
		}).Fatal(cerror.DQUIZ_REDIS_OP_FAIL)
		return "", models.NewAppError(err, cerror.BuildRedisGetFailMsg(key), models.GetFuncName())
	}
	return result, nil
}

func RedisSet(conn *redis.Conn, key string, val string, lifeTime int) *models.AppError {
	_, err := (*conn).Do("SET", key, val)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"err" : err,
		}).Fatal(cerror.DQUIZ_REDIS_OP_FAIL)
		return models.NewAppError(err, cerror.DQUIZ_REDIS_OP_FAIL, models.GetFuncName())
	}

	if lifeTime != 0 {
		_, err = (*conn).Do("EXPIRE", key, lifeTime)
		if err != nil {
			web.Logger.WithFields(logrus.Fields{
				"key" : key,
				"life_time": lifeTime,
			}).Fatal(cerror.DQUIZ_REDIS_OP_FAIL)
		}
		return models.NewAppError(err, cerror.DQUIZ_REDIS_OP_FAIL, models.GetFuncName())
	}
	return nil
}
