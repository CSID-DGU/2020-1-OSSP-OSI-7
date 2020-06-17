package chatbot

import (
	"encoding/json"
	"google.golang.org/api/chat/v1"
	"oss/models"
	"oss/redisUtil"
	"oss/test/utils"
	"oss/web"
	"strconv"
)

type AnswerMessage struct {
	value string
}


func (a *AnswerMessage) Process(email string) (interface{}, *models.AppError) {
	/*
		3. 객관식 답안 제출이랑 단답형 답안 제출이 있음
		4. 채점스케쥴러에 입력
		5. 다음 퀴즈 혹은 퀴즈를 다 풀었음을 알리는 메시지 출력
	*/
	return nil, nil
}


// 퀴즈를 풀어저 제출했을 때 다음 퀴즈를 리턴해준다
// 리턴 값은 DeprecatedQuiz의 json 이다
// email 을 가지고 다음 퀴즈의 quizId 를 가져온다
// quizid 를 가지고 Redis 에서 quiz 를 가져온다
// 퀴즈를 hangout message로 만든다.
// 만약에 list 가 비어있으면 끝났다는 메세지를 보낸다.
func GetNextQuiz (c *web.Context, email string) *chat.Message {
	conn := c.Redis.Get()
	defer utils.CloseRedisConnection(&conn)
	var nextQuizStruct *models.Quiz
	var byteQuizContent []byte
	nextQuizId, err := redisUtil.RedisPopFromQueue(&conn, email)
	if err != nil {
		// 퀴즈 응시가 끝났습니다.
		return makeTextResponse("퀴즈 응시가 끝났습니다. 수고하셨습니다.")
	}
	println(nextQuizId)
	// nextQuizId 를 이용해서 퀴즈를 데이터베이스 or Redis 에서 가져온다.
	nextQuiz, err := redisUtil.GetQuizFromRedisByQuizId(&conn, nextQuizId)

	if err != nil {
		intQuizId, err := strconv.ParseInt(nextQuizId, 10, 64)
		if err != nil {
			println("parsing error")
			return nil
		}
		result, db_err := c.Repositories.QuizRepository().GetQuizByQuizId(intQuizId)
		if db_err != nil {
			// TODO 에러 처리
		}
		return makeQuizCard(email, result)

	} else {
		byteQuizContent = []byte(nextQuiz)
		unmarshal_err := json.Unmarshal(byteQuizContent, &nextQuizStruct)
		if unmarshal_err != nil {
			// TODO 에러처리
		}
		return makeQuizCard(email, nextQuizStruct)
	}
}

func (a *AnswerMessage) fetchNext(userEmail string) (interface{}, *models.AppError) {
	/*
			if [ len(user submitted quiz) >= len(quiz set's quizzes) ]
				return END MESSAGE

			getQuizSetId = get from redis with user email
		 	nextQuizIndex = pop from Redis <user will solve quiz queue>
			nextQuiz = get from Redis using "getQuizSetId, nextQuizIndex"
			Redis 채점 큐에 넣기
			return nextQuiz
	*/
	return nil, nil
}


