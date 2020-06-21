package redisUtil

import (
	"errors"
	"fmt"
	"github.com/gomodule/redigo/redis"
	"github.com/sirupsen/logrus"
	"oss/cerror"
	"oss/models"
	"oss/web"
)

const (
	QUIZ_ANSWER_EXPIRE_TIME = 60 * 10
	HOUR = 60 * 60
)

// <TESTING>이메일 의 정보로 유저가 어떤 classQuizSet 을 응시하고 있는지 저장
func TestingClassQuizSetIdKey(email string) string {
	return "<TESTING>" + email
}
func RedisGet(conn *redis.Conn, key string) (string, *models.AppError) {
	result, err := redis.String((*conn).Do("GET", key))
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"err": err,
		}).Info(cerror.DQUIZ_REDIS_OP_FAIL)
		return "", models.NewAppError(err, cerror.BuildRedisGetFailMsg(key), models.GetFuncName())
	}
	return result, nil
}

func RedisGetInt(conn *redis.Conn, key string) (int64, *models.AppError) {
	result, err := redis.Int64((*conn).Do("GET", key))
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"err": err,
		}).Info(cerror.DQUIZ_REDIS_OP_FAIL)
		return -1, models.NewAppError(err, cerror.BuildRedisGetFailMsg(key), models.GetFuncName())
	}
	return result, nil
}

func RedisSetByte(conn *redis.Conn, key string, val []byte, lifeTime int) *models.AppError {
	_, err := (*conn).Do("SET", key, val)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"err": err,
		}).Error(cerror.DQUIZ_REDIS_OP_FAIL)
		return models.NewAppError(err, cerror.DQUIZ_REDIS_OP_FAIL, models.GetFuncName())
	}

	if lifeTime != 0 {
		_, err = (*conn).Do("EXPIRE", key, lifeTime)
		if err != nil {
			web.Logger.WithFields(logrus.Fields{
				"key":       key,
				"life_time": lifeTime,
			}).Error(cerror.DQUIZ_REDIS_OP_FAIL)
		}
		return models.NewAppError(err, cerror.DQUIZ_REDIS_OP_FAIL, models.GetFuncName())
	}
	return nil
}

func RedisSet(conn *redis.Conn, key string, val string, lifeTime int) *models.AppError {
	_, err := (*conn).Do("SET", key, val)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"err": err,
		}).Error(cerror.DQUIZ_REDIS_OP_FAIL)
		return models.NewAppError(err, cerror.DQUIZ_REDIS_OP_FAIL, models.GetFuncName())
	}

	if lifeTime != 0 {
		_, err = (*conn).Do("EXPIRE", key, lifeTime)
		if err != nil {
			web.Logger.WithFields(logrus.Fields{
				"key":       key,
				"life_time": lifeTime,
			}).Error(cerror.DQUIZ_REDIS_OP_FAIL)
		}
		return models.NewAppError(err, cerror.DQUIZ_REDIS_OP_FAIL, models.GetFuncName())
	}
	return nil
}

func RedisCreateQueue(conn *redis.Conn, queueName string, data string) *models.AppError {
	_, err := (*conn).Do("LREM", queueName, 1, data)
	if err != nil {
		fmt.Println(err.Error())
	}
	_, err = (*conn).Do("LPUSH", queueName, data)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"queue_name": queueName,
			"cerror":     err.Error(),
		}).Error("Failed to push Redis queue")
	}
	return models.NewRedisError(err, "failed to push redis queue", "")
}

func RedisPopFromQueue(conn *redis.Conn, queueName string) (string, *models.AppError) {
	data, err := redis.String((*conn).Do("LPOP", queueName))
	if err != nil {
		return "", models.NewRedisError(err, "failed to pop Redis queue", "")
	}
	return data, nil
}

func RedisRangeFromQueue(conn *redis.Conn, queueName string) (string, *models.AppError) {
	data, err := redis.Strings((*conn).Do("LRANGE", queueName, 0, 0))
	if err != nil {
		return "", models.NewRedisError(err, "failed to pop Redis queue", "")
	}

	if len(data) > 0 {
		return data[0], nil
	}
	return "", models.NewAppError(errors.New("no element"), "", "")
}