package service

import (
	"encoding/json"
	"fmt"
	"github.com/gomodule/redigo/redis"
	"github.com/sirupsen/logrus"
	"oss/dto"
	"oss/models"
	"oss/redisUtil"
	"oss/test/utils"
	"oss/web"
	"strconv"
	"time"
)

/**
 퀴즈 셋 채점 요청
 데이터 베이스 에서 퀴즈 가져오기
 퀴즈 타입에 따라 가져온 answer 이용해서 채점하기
 */
const (
	SCORE_BATCH_SIZE = 100
	SCORING_QUEUE = "SCORING_QUEUE"
	CLASS_QUIZ_SET_QUEUE = "CLASS_QUIZ_SET_QUEUE"
	QUEUE = "QUEUE"

)

// Redis 에서 scoring 과 관련된 queue 들을
// 식별하기 위한 필드를 가지고 있는 구조체
type ScoringQueueIdent struct {
	ClassQuizSetId int64
	Email string
}

type SubmittedQuiz struct {
	*ScoringQueueIdent
	*QuizForScoring
}

type QuizForScoring struct {
	QuizId int64 `redis:"qid" json:"qid"`
	QuizType string `redis:"qtype" json:"qtype"`
	QuizAnswer string `redis:"qans" json:"qnas"`
}

type QuizSetForScoring struct {
	ClassQuizSetId int64
	UserId int64
	QuizForScorings []QuizForScoring
}

type QuizForScoringStore struct {
	QuizForScorings []QuizForScoring
}

func unMarshalQuizForScoring(quizForScoringJson string) (*QuizForScoring, error){
	var quizForScoring *QuizForScoring
	err := json.Unmarshal([]byte(quizForScoringJson), &quizForScoring)
	if err != nil {
		return nil, err
	}
	return quizForScoring, nil
}

func getUserQuizQueueName (classQuizSetId int64, email string) string {
	strClassQuizSetId := strconv.FormatInt(classQuizSetId, 10)
	return strClassQuizSetId + "-" + email
}

func deleteQueue (pool *redis.Pool, key string) {
	conn := pool.Get()
	defer utils.CloseRedisConnection(&conn)
	_, err := conn.Do("DEL", key)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"list_name" : key,
		}).Error("Failed to delete List")
	}
}

func fetchAllUserQuizFromQueue (pool *redis.Pool, classQuizSetId int64, userEmail string) []*QuizForScoring {
	conn := pool.Get()
	defer utils.CloseRedisConnection(&conn)
	var quizForScorings []*QuizForScoring
	queueName := getUserQuizQueueName(classQuizSetId, userEmail)
	result, err := redis.Strings(conn.Do("LRANGE", queueName, 0, -1))

	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"quiz_set_id" : classQuizSetId,
			"user_email" : userEmail,
		}).Error("Failed to retrieve quizzes from Redis")
	} else {
		for _, rst := range result {
			quizForScoring, err := unMarshalQuizForScoring(rst)
			if err != nil  {
				web.Logger.WithFields(logrus.Fields{
					"input_quiz_for_scoring_json" : rst,
				}).Error("Failed to retrieve quiz from Redis")
			}
			quizForScorings = append(quizForScorings, quizForScoring)
		}
	}
	go deleteQueue(pool, queueName)
	return quizForScorings
}

func pushQuizToUserQuizQueue(pool *redis.Pool, quiz *SubmittedQuiz) {
	conn := pool.Get()
	utils.CloseRedisConnection(&conn)
	queueName := getUserQuizQueueName(quiz.ClassQuizSetId, quiz.Email)

	// TODO 예외 처리 및 validation
	// 제출한 퀴즈가 올바르지 않은 형식인 경우
	data, err := json.Marshal(quiz)

	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"queue_name" : queueName,
			"cerror" : err.Error(),
		}).Fatal("Failed to push quiz to user quiz queue")
		return
	}

	_, err = conn.Do("LREM", queueName, 1, data)
	if err != nil {
		fmt.Println(err.Error())
	}
	_, err = conn.Do("LPUSH", queueName, data)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"queue_name" : queueName,
			"cerror" : err.Error(),
		}).Fatal("Failed to set scoring set Redis")
	}
}

// Redis 에 classQuizSet 의 응시생에 대한 key 값을 추가
func pushClassQuizSetQueue(pool *redis.Pool, classQuizSetId int64, email string) {
	conn := pool.Get()
	utils.CloseRedisConnection(&conn)
	strClassQuizSetId := strconv.FormatInt(classQuizSetId, 10)
	key := strClassQuizSetId + "-" + QUEUE
	elem := strClassQuizSetId + "-" + email
	_, err := conn.Do("LREM", key, 1, elem)
	if err != nil {
		fmt.Println(err.Error())
	}
	_, err = conn.Do("LPUSH", key, elem)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"classQuizSetId" : classQuizSetId,
			"cerror" : err.Error(),
		}).Fatal("Failed to set scoring set Redis")
	}
}

func pushScoringSet(conn redis.Conn, classQuizSetId int64) (int64, error) {
	result, err := conn.Do("LREM", SCORING_QUEUE, 1, classQuizSetId)
	if err != nil {
		fmt.Println(err.Error())
	}
	result, err = conn.Do("LPUSH", SCORING_QUEUE, classQuizSetId)
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"classQuizSetId" : classQuizSetId,
			"cerror" : err.Error(),
		}).Fatal("Failed to set scoring set Redis")
		return -1, err
	}
	return result.(int64), nil
}

func scoringSetExists (conn redis.Conn, classQuizSetId int64) (bool, error) {
	result, err := redis.Bool(conn.Do("EXISTS", classQuizSetId))
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"classQuizSetId" : classQuizSetId,
		}).Fatal("Failed LPUSH to Redis")
		return false, err
	}
	return result, nil
}

func scoreMultiSelectQuiz (quizForScoring *QuizForScoring, answer string) bool {
	return quizForScoring.QuizAnswer == answer
}

func scoreSimpleQuiz (quizForScoring *QuizForScoring, answer string) bool {
	return true
}

func scoreQuiz (quizForScoring *QuizForScoring, answer string) bool {
	switch quizForScoring.QuizType {
		case models.QUIZ_TYPE_MULTI:
			return scoreMultiSelectQuiz(quizForScoring, answer)
	 	case models.QUIZ_TYPE_SIMPLE:
	 		return scoreSimpleQuiz(quizForScoring, answer)
	}
	return false
}

func updateQuizSetResult (context *web.Context, quizSetResult *models.QuizSetResult ,completeQuiz chan *dto.QuizAnswerWithScore, length int) {
	var lenAcc int = 0
	var scoreAcc uint64 = 0
	for {
		select {
			case quiz := <- completeQuiz:
				lenAcc++
				scoreAcc += quiz.QuizScore
				if lenAcc == length {
					// 누적된 채점 점수로 TotalScore 를 갱신함.
					quizSetResult.TotalScore = scoreAcc
					context.Repositories.QuizSetResultRepository().Update(quizSetResult)
				}
		}
	}
}

func ScoreQuizzes (context *web.Context, ident ScoringQueueIdent, quizScorings []*QuizForScoring) *models.AppError {
	// quiz 답을 가져오기 위한 Redis connection
	conn := context.Redis.Get()
	utils.CloseRedisConnection(&conn)
	if quizScorings == nil || len(quizScorings) == 0 {
		logMsg := "quizForScoring array which is passed to ScoreQuizzes is null"
		web.Logger.Fatal(logMsg)
		return models.NewAppError(nil, logMsg, models.GetFuncName())
	}

	result, err := context.Repositories.QuizSetResultRepository().Get(ident.ClassQuizSetId, ident.Email)
	if err != nil {
		logMsg := "failed to create quiz set result"
		web.Logger.WithFields(logrus.Fields{
			"err" : err,
		}).Fatal(logMsg)
	}

	if result == nil {
		userId, err := context.Repositories.UserRepository().GetUserIdByUserName(ident.Email)
		if err != nil {
			// TODO 채점을 실패한 경우와 다르지 않으므로 Job Queue 에 넣어서 나중에 재시도 해야 함
		}

		result = &models.QuizSetResult {
			ClassQuizSetId: ident.ClassQuizSetId,
			UserId: userId,
			TotalScore: 0,
		}
		create_err := context.Repositories.QuizSetResultRepository().Create(result)
		if create_err != nil {
			// TODO 채점을 실패한 경우와 다르지 않으므로 Job Queue 에 넣어서 나중에 재시도 해야 함
		}
	}

	quizResultCompleteChan := make(chan *dto.QuizAnswerWithScore, len(quizScorings))
	for _, quiz := range quizScorings {
		answer, err := redisUtil.RedisGet(&conn, string(quiz.QuizId)+"-"+"ans")
		strScore, err := redisUtil.RedisGet(&conn, string(quiz.QuizId)+"-"+"score")
		score, parse_err := strconv.ParseUint(strScore, 10, 64)
		if parse_err != nil {
			web.Logger.WithFields(logrus.Fields{
				"quiz_id" : quiz.QuizId,
				"str_score" : strScore,
			}).Fatal("failed to parse score retrieved by Redis")
		}

		if err != nil {
			// TODO 에러 확인
		}

		if answer == "" {
			answerWithScore, db_err := context.Repositories.QuizRepository().GetQuizAnswerWithScoreByQuizId(quiz.QuizId)
			if db_err != nil || answerWithScore.QuizAnswer == "" {
				// TODO 현재 퀴즈 채점 하는데 필요한 답을 가져오는데 실패 했으므로 재시도 처리
				continue
			}
			answer = answerWithScore.QuizAnswer
			score = answerWithScore.QuizScore
		}

		scoreResult := scoreQuiz(quiz, answer)
		quizResult := &models.QuizResult {
			QuizSetResultId: result.QuizSetResultId,
			UserId: result.UserId,
			QuizId: quiz.QuizId,
			Correct: scoreResult,
		}

		if scoreResult == false {
			score = 0
		}
		context.Repositories.QuizResultRepository().Create(quizResult)
		quizResultCompleteChan <- &dto.QuizAnswerWithScore{
			QuizAnswer: answer,
			QuizScore: score,
		}
	}
	return nil
}

func ScheduleQuizSetScoring (pool *redis.Pool, scoringRequest chan SubmittedQuiz) {
	var scoreQueue []*QuizForScoring
	prevTime := time.Now()
	var threshHold int64 = 10 * 60
	conn := pool.Get()
	defer conn.Close()
	for {
		select {
			case submitted := <- scoringRequest:
				currTime := time.Now()
				diff := currTime.Unix() - prevTime.Unix()
				scoreQueue = append(scoreQueue, submitted.QuizForScoring)
				quizSetScoringQueue := strconv.FormatInt(submitted.ClassQuizSetId, 10)+"-"+submitted.Email
				//quizSetScoringQueue := submitted.ClassQuizSetId+"-"+submitted.Email
				//_, err := conn.Do("LLEN", quizSetScoringQueue)
				data, err := json.Marshal(&submitted)
				if err != nil {
					web.Logger.WithFields(logrus.Fields{
						"quiz" : submitted,
					}).Error("Failed to marshaling QuizForScoring to json")
				}
				_, err = conn.Do("LPUSH", quizSetScoringQueue, data)
				if err != nil {
					web.Logger.WithFields(logrus.Fields{
						"quiz" : submitted,
					}).Error("Failed LPUSH to Redis")
				}

				_, err = pushScoringSet(conn, submitted.ClassQuizSetId)
				if err != nil {
					fmt.Println(err)
				} else {

				}

				pushClassQuizSetQueue(pool, submitted.ClassQuizSetId, submitted.Email)
				pushQuizToUserQuizQueue(pool, &submitted)
				fetchAllUserQuizFromQueue(pool, submitted.ClassQuizSetId, submitted.Email)

				if diff > threshHold ||  len(scoreQueue) > SCORE_BATCH_SIZE {
					for i, _ := range scoreQueue {
						_, err := conn.Do("SET", i, submitted.QuizType)
						if err != nil {
							v := string(submitted.QuizType)
							println(v, " is invalid")
						}
						//var data []byte
						_, err1 := redis.Bytes(conn.Do("GET", i))
						if err1 != nil {
							println("get cerror")
						}

					}
				}
		}
	}
}

func QuizSetScoring (pool *redis.Pool, classQuizSetId int64) {
	// DB 에서 해당 되는 퀴즈 셋과 퀴즈를 모두 읽는다. (답도 포함되어 있어야 함)
	// redis 에서 classQuizSetId-scoring-queue 를 순회하면서 이 queue의 원소인
	// email-classQuizSetId 의 key 를 가져온다. 이 queue는  유저가 풀어저 제출한
	// quizForScoring 을 원소들로 갖는다.
}

// 타입을 기반으로 퀴즈를 채점한다.
func QuizScoring (c *web.Context) {

}
