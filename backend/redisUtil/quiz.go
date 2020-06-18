package redisUtil

import (
	"encoding/json"
	"github.com/gomodule/redigo/redis"
	"github.com/sirupsen/logrus"
	"oss/cerror"
	"oss/models"
	"oss/test/utils"
	"oss/util"
	"oss/web"
	"strconv"
)

func setRedisQuiz (conn *redis.Conn, quiz *models.Quiz) {
	quizId := strconv.FormatInt(quiz.QuizId, 10)
	data, err := json.Marshal(&quiz)
	if err != nil {

	}
	RedisSetByte(conn, quizId, data, 0)
}

// RedisUtil 로 옮겨야 함
func makeRedisQuizSequenceQueue (conn *redis.Conn, email string, quizzes []models.Quiz) {
	for _, quiz := range quizzes {
		quizId := strconv.FormatInt(quiz.QuizId, 10)
		err := RedisCreateQueue(conn, email, quizId)
		if err != nil {
			// TODO redis failure 처리
		}
	}
}

// 유저가 풀어야 할 퀴즈들을 Redis 리스트에 랜덤하게 generate 한다
func MakeQuizQueue (c *web.Context, email string, classQuizSetId int64) *models.AppError {
	conn := c.Redis.Get()
	defer utils.CloseRedisConnection(&conn)
	quizzes, err := c.Repositories.QuizRepository().GetQuizzesByClassQuizSetId(classQuizSetId)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"err" : err,
		}).Warning(cerror.DQUIZ_DB_OPERATION_ERROR)
		return err
	}
	for _, quiz := range quizzes {
		setRedisQuiz(&conn, &quiz)
	}

	quizzes = util.ShuffleQuizzes(quizzes)
	makeRedisQuizSequenceQueue(&conn, email, quizzes)
	return nil
}

func GetQuizFromRedisByQuizId (conn *redis.Conn, quizId string) (string, *models.AppError){
	return RedisGet(conn, quizId)
}

