package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gomodule/redigo/redis"
	"github.com/sirupsen/logrus"
	"oss/dto"
	"oss/models"
	"oss/redisUtil"
	"oss/test/utils"
	"oss/web"
	"strconv"
	"strings"
	"time"
)

/**
 퀴즈 셋 채점 요청
 데이터 베이스 에서 퀴즈 가져오기
 퀴즈 타입에 따라 가져온 answer 이용해서 채점하기
 */
const (
	SCORE_BATCH_SIZE = 1
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
	*dto.QuizForScoring
}

func getClassQuizSetQueueName (classQuizSetId string) string {
	return classQuizSetId + "-" + "QUEUE"
}

func getUserQuizQueueName (classQuizSetId int64, email string) string {
	strClassQuizSetId := strconv.FormatInt(classQuizSetId, 10)
	return strClassQuizSetId + "-" + email
}

func unMarshalQuizForScoring (quizForScoringJson string) (*dto.QuizForScoring, error){
	var quizForScoring *dto.QuizForScoring
	err := json.Unmarshal([]byte(quizForScoringJson), &quizForScoring)
	if err != nil {
		return nil, err
	}
	return quizForScoring, nil
}

func deleteQueue (conn *redis.Conn, key string) *models.AppError {
	_, err := (*conn).Do("DEL", key)
	if err != nil {
		message := "Failed to delete List"
		web.Logger.WithFields(logrus.Fields{
			"list_name" : key,
		}).Error(message)
		return models.NewRedisError(err, message, models.GetFuncName())
	}
	return nil
}

// Scoring Queue 에서 모든 데이터를 가져온 다음에 모두 삭제 한다.
func fetchAllFromScoringQueue (conn *redis.Conn) ([]string, *models.AppError) {
	result, err := redis.Strings((*conn).Do("LRANGE", SCORING_QUEUE, 0, -1))
	if err != nil {
		message := "Failed to delete element from ScoringQueue"
		web.Logger.Error(message)
		return nil, models.NewAppError(err, message, models.GetFuncName())
	}

	if result == nil {
		return nil, nil
	}

	del_err := deleteQueue(conn, SCORING_QUEUE)
	if del_err != nil {
		web.Logger.Error(del_err.DetailedError)
		return nil, del_err
	}
	return result, nil
}

func fetchAllUserQuizQueueFromQueue (conn *redis.Conn, queueName string) ([]string, *models.AppError) {
	result, err := redis.Strings((*conn).Do("LRANGE", queueName, 0, -1))
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"queue_name": queueName,
		}).Error("Failed to retrieve quizzes from Redis")
		return nil, models.NewRedisError(err, "", models.GetFuncName())
	}
	return result, nil
}

func fetchAllUserQuizFromQueue (conn *redis.Conn, queueName string) []*dto.QuizForScoring {
	var quizForScorings []*dto.QuizForScoring
	result, err := redis.Strings((*conn).Do("LRANGE", queueName, 0, -1))

	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"queue_name" : queueName,
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
	go deleteQueue(conn, queueName)
	return quizForScorings
}

// Scoring 관련 Redis Queue 중 가장 넓은 범위의 Queue
// 채점해야 할 QuizSet 들을 원소로 가진다.
func pushKeyToScoringQueue (conn *redis.Conn, queueName, key string) *models.AppError {
	_, err := (*conn).Do("LREM", queueName, 0, key)
	if err != nil {
		message := "Failed to delete element from ScoringQueue"
		web.Logger.WithFields(logrus.Fields{
			"list_name" : key,
		}).Error(message)
		return models.NewAppError(err, message, models.GetFuncName())
	}
	_, err = (*conn).Do("RPUSH", queueName, key)
	if err != nil {
		message := "Failed to RPUSH element into ScoringQueue"
		web.Logger.WithFields(logrus.Fields{
			"list_name" : key,
		}).Error(message)
		return models.NewAppError(err, message, models.GetFuncName())
	}
	return nil
}

func pushQuizToUserQuizQueue(pool *redis.Pool, quiz *SubmittedQuiz) {
	conn := pool.Get()
	defer utils.CloseRedisConnection(&conn)
	queueName := getUserQuizQueueName(quiz.ClassQuizSetId, quiz.Email)

	// TODO 예외 처리 및 validation
	// 제출한 퀴즈가 올바르지 않은 형식인 경우
	data, err := json.Marshal(quiz)

	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"queue_name" : queueName,
			"cerror" : err.Error(),
		}).Error("Failed to push quiz to user quiz queue")
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
		}).Error("Failed to set scoring set Redis")
	}
}

// Redis 에 classQuizSet 의 응시생에 대한 key 값을 추가
func pushClassQuizSetQueue(pool *redis.Pool, classQuizSetId int64, email string) {
	conn := pool.Get()
	defer utils.CloseRedisConnection(&conn)
	strClassQuizSetId := strconv.FormatInt(classQuizSetId, 10)
	key := getClassQuizSetQueueName(strClassQuizSetId)
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
		}).Error("Failed to set scoring set Redis")
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
		}).Error("Failed to set scoring set Redis")
		return -1, err
	}
	return result.(int64), nil
}

func scoringSetExists (conn redis.Conn, classQuizSetId int64) (bool, error) {
	result, err := redis.Bool(conn.Do("EXISTS", classQuizSetId))
	if err != nil {
		web.Logger.WithFields(logrus.Fields{
			"classQuizSetId" : classQuizSetId,
		}).Error("Failed LPUSH to Redis")
		return false, err
	}
	return result, nil
}

func scoreMultiSelectQuiz (quizForScoring *dto.QuizForScoring, answer string) bool {
	return quizForScoring.QuizAnswer == answer
}

func scoreShortQuiz (quizForScoring *dto.QuizForScoring, answer string) bool {
	answers := strings.Split(answer, ",")
	for _, ans := range answers {
		if quizForScoring.QuizAnswer == ans {
			return true
		}
	}
	return false
}

func scoreQuiz (quizForScoring *dto.QuizForScoring, answer string) bool {
	switch quizForScoring.QuizType {
		case models.QUIZ_TYPE_MULTI:
			return scoreMultiSelectQuiz(quizForScoring, answer)
	 	case models.QUIZ_TYPE_SHORT:
	 		return scoreShortQuiz(quizForScoring, answer)
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
					quizSetResult.MyScore = scoreAcc
					context.Repositories.QuizSetResultRepository().Update(quizSetResult)
				}
		}
	}
}

func ScoreQuizzes (context *web.Context, ident ScoringQueueIdent, quizScorings []*dto.QuizForScoring) *models.AppError {
	// quiz 답을 가져오기 위한 Redis connection
	conn := context.Redis.Get()
	defer utils.CloseRedisConnection(&conn)
	if quizScorings == nil || len(quizScorings) == 0 {
		logMsg := "quizForScoring array which is passed to ScoreQuizzes is null"
		web.Logger.Error(logMsg)
		return models.NewAppError(nil, logMsg, models.GetFuncName())
	}

	result, err := context.Repositories.QuizSetResultRepository().Get(ident.ClassQuizSetId, ident.Email)
	if err != nil {
		logMsg := "failed to get quiz set result"
		web.Logger.WithFields(logrus.Fields{
			"err" : err,
		}).Error(logMsg)
	}

	if result == nil {
		userId, err := context.Repositories.UserRepository().GetUserIdByUserName(ident.Email)
		if err != nil {
			// TODO 채점을 실패한 경우와 다르지 않으므로 Job Queue 에 넣어서 나중에 재시도 해야 함
		}

		result = &models.QuizSetResult {
			ClassQuizSetId: ident.ClassQuizSetId,
			UserId: userId,
			MyScore: 0,
		}
		create_err := context.Repositories.QuizSetResultRepository().Create(result)
		if create_err != nil {
			// TODO 채점을 실패한 경우와 다르지 않으므로 Job Queue 에 넣어서 나중에 재시도 해야 함
		}
	}

	quizResultCompleteChan := make(chan *dto.QuizAnswerWithScore, len(quizScorings))
	go updateQuizSetResult(context, result, quizResultCompleteChan, len(quizScorings))
	for _, quiz := range quizScorings {
		var score uint64
		answer, err := redisUtil.RedisGet(&conn, string(quiz.QuizId)+"-"+"ans")
		strScore, err := redisUtil.RedisGet(&conn, string(quiz.QuizId)+"-"+"score")
		if err != nil {
			// TODO 에러 확인
			answerWithScore, db_err := context.Repositories.QuizRepository().GetQuizAnswerWithScoreByQuizId(quiz.QuizId)
			if db_err != nil || answerWithScore.QuizAnswer == "" {
				// TODO 현재 퀴즈 채점 하는데 필요한 답을 가져오는데 실패 했으므로 재시도 처리
				continue
			}
			answer = answerWithScore.QuizAnswer
			score = answerWithScore.QuizScore
			redisUtil.RedisSet(&conn, string(quiz.QuizId)+"-"+"ans", answer, 30)
			redisUtil.RedisSet(&conn, string(quiz.QuizId)+"-"+"score", string(score),30)
		} else {
			var parse_err error
			score, parse_err = strconv.ParseUint(strScore, 10, 64)
			if parse_err != nil {
				web.Logger.WithFields(logrus.Fields{
					"quiz_id" : quiz.QuizId,
					"str_score" : strScore,
				}).Error("failed to parse score retrieved by Redis")
			}
		}

		scoreResult := scoreQuiz(quiz, answer)
		quizResult := &models.QuizResult {
			QuizSetResultId: result.QuizSetResultId,
			QuizId: quiz.QuizId,
			Correct: scoreResult,
		}

		if scoreResult == false {
			score = 0
		}
		result, err := context.Repositories.QuizResultRepository().Get(result.QuizSetResultId, quiz.QuizId)
		if err == nil && result != nil {
			return models.NewAppError(errors.New("ANSWER_ALREADY_SUBMITTED"),
									  "이미 답안을 제출 했습니다.", models.GetFuncName())
		}

		if err != nil {
			web.Logger.WithFields(logrus.Fields{
				"quiz_result" : quizResult,
				"err" : err,
			}).Warn("It could be DB error not just failed to fetch row")
		}

		create_err := context.Repositories.QuizResultRepository().Create(quizResult)
		if create_err != nil {
			web.Logger.WithFields(logrus.Fields{
				"quiz_result" : quizResult,
			}).Warn("Failed to create QuizResult")
		}
		quizResultCompleteChan <- &dto.QuizAnswerWithScore{
			QuizAnswer: answer,
			QuizScore: score,
		}
	}
	return nil
}

func ScheduleQuizSetScoring (pool *redis.Pool, scoringRequest chan SubmittedQuiz) {
	var quizAccCount int64
	prevTime := time.Now()
	var threshHold int64 = 10 * 60
	conn := pool.Get()
	defer utils.CloseRedisConnection(&conn)
	for {
		select {
			case submitted := <- scoringRequest:
				quizAccCount++
				currTime := time.Now()
				diff := currTime.Unix() - prevTime.Unix()
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
				//pushKeyToScoringQueue(&conn, SCORING_QUEUE, string(submitted.ClassQuizSetId))
				pushClassQuizSetQueue(pool, submitted.ClassQuizSetId, submitted.Email)
				pushQuizToUserQuizQueue(pool, &submitted)

				if diff > threshHold ||  quizAccCount > SCORE_BATCH_SIZE {
					results, err := fetchAllFromScoringQueue(&conn)
					if err != nil {
						web.Logger.WithFields(logrus.Fields{
							"quiz" : submitted,
						}).Error(err.DetailedError)
					}
					for _, quizSetId := range results {
						userQueueNames, err := fetchAllUserQuizQueueFromQueue(&conn, getClassQuizSetQueueName(quizSetId))
						if err != nil {
							// TODO 에러 처리
							web.Logger.WithFields(logrus.Fields{
								"quiz" : submitted,
							}).Error(err.DetailedError)
						}
						for _, userQueueName := range userQueueNames {
							quizForScorings := fetchAllUserQuizFromQueue(&conn, userQueueName)
							splitted := strings.Split(userQueueName, "-")
							classQuizSetId, err := strconv.ParseInt(splitted[0], 10, 64)
							if err != nil {
								web.Logger.WithFields(logrus.Fields{
									"target" : classQuizSetId,
								}).Error(err.Error())
								continue
							}

							ScoreQuizzes(web.Context0,
								ScoringQueueIdent{classQuizSetId, splitted[1]},
								quizForScorings)
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
func QuizScoring (c *web.Context, classQuizSetId int64) {

}
