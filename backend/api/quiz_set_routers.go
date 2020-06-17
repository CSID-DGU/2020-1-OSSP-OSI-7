package api

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"oss/cerror"
	"oss/dto"
	"oss/models"
	"oss/service"
	"oss/web"
	"strconv"
)

// @tags Quiz set
// @Summary 해당 강의가 가지고 있는 모든 퀴즈 셋을 반환한다
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param classCode JSON body dto.QuizCreateForm true "퀴즈 셋을 조회할 강의의 학수 번호"
// @Router /quizsets/classes/{classCode} [GET]
// @Failure 400 {string} INVALID_PATH_PARAMETER
func GetQuizSetsOfClass (context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		classCode := c.Param("classCode")

		quizSets, err := context.Repositories.QuizSetRepository().GetQuizSetsByClassCode(classCode)

		if err != nil {
			c.JSON(500, "DATA_NOT_FOUND")
		}

		if quizSets ==  nil {
			c.JSON(404, "DATA_NOT_FOUND")
			return
		}

		var quizSetGetForms []dto.ClassQuizSetGetForm
		for _, quizSet := range quizSets {
			user, err := context.Repositories.UserRepository().GetByUserId(quizSet.UserId)
			quizzes, err := context.Repositories.QuizRepository().GetQuizzesByQuizSetId(quizSet.QuizSetId)
			if err != nil {
				c.JSON(500, INTERNAL_SERVER_ERROR)
			}

			var quizGetForms []dto.QuizGetForm

			for _, quiz := range quizzes {
				quizGetForms = append(quizGetForms, dto.QuizGetForm {
					QuizId: quiz.QuizId,
					QuizTitle: quiz.QuizTitle,
					QuizContent: quiz.QuizContent,
					QuizAnswer: quiz.QuizAnswer,
					QuizType: quiz.QuizType,
				})
			}

			quizSetGetForm := dto.ClassQuizSetGetForm {
				ClassQuizSetId: quizSet.ClassQuizSetId,
				QuizSetName: quizSet.QuizSetName,
				QuizSetAuthorUserName: user.UserName,
				Quizzes: quizGetForms,
			}
			quizSetGetForms  = append(quizSetGetForms, quizSetGetForm)
		}
		c.JSON(200, quizSetGetForms)
	}
}

// @tags Quiz set
// @Summary ClassQuizSetId에 해당하는 Quiz set 을 가져온다.
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param classQuizSetId path string true "불러오려는 QuizSetId"
// @Router /quizsets/class/{classQuizSetId} [GET]
// @Success 200 {object} dto.ClassQuizSetGetForm "퀴즈 셋"
// @Failure 400 {string} string "INVALID_PATH_PARAMETER"
func GetQuizSetByClassQuizSetId (context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		classQuizSetIdString := c.Param("classQuizSetId")
		classQuizSetId, err := strconv.ParseInt(classQuizSetIdString, 10, 64)
		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER + "=> NO quiz set of ClassQuizSetId")
		}
		classQuizSetGetForm, db_err := context.Repositories.ClassQuizSetRepository().GetClassQuizSetGetFormByClassQuizSetId(classQuizSetId)
		if db_err != nil {
			web.Logger.WithFields(logrus.Fields{
				"err" : db_err,
			}).Warning(cerror.DQUIZ_DB_OPERATION_ERROR)
		}

		quizzes, db_err := context.Repositories.QuizRepository().GetQuizzesByClassQuizSetId(classQuizSetGetForm.ClassQuizSetId)
		if db_err != nil {
			web.Logger.WithFields(logrus.Fields{
				"err" : db_err,
			}).Warning(cerror.DQUIZ_DB_OPERATION_ERROR)
		}

		var getFormQuizzes []dto.QuizGetForm
		for _, quiz := range quizzes {
			getFormQuizzes = append(getFormQuizzes, dto.QuizGetForm{
				QuizId: quiz.QuizId,
				QuizTitle: quiz.QuizTitle,
				QuizContent: quiz.QuizContent,
				QuizType: quiz.QuizType,
			})
		}
		classQuizSetGetForm.Quizzes = getFormQuizzes

		c.JSON(200, classQuizSetGetForm)
	}
}

// @tags Quiz set
// @Summary Quiz set 을 채점한다.
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetForScoring JSON body dto.QuizSetForScoring true "채점 하려는 퀴즈 셋"
// @Router /quizsets/score [POST]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string "INVALID_PATH_PARAMETER"
func ScoreQuizzes (context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		var quizSetForScoring *dto.QuizSetForScoring
		err := c.Bind(&quizSetForScoring)
		if err != nil || quizSetForScoring == nil {
			c.JSON(400, INVALID_REQUEST_BODY)
		}

		service.ScoreQuizzes(context, service.ScoringQueueIdent{
			ClassQuizSetId: quizSetForScoring.ClassQuizSetId,
			Email: quizSetForScoring.UserName}, quizSetForScoring.QuizForScorings)

	}
}

// @tags Quiz set
// @Summary 퀴즈셋을 생성한다
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetInfo JSON body dto.QuizSetCreateForm true "퀴즈셋 정보"
// @Router /quizsets/quizset [POST]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string INVALID_PATH_PARAMETER
func CreateQuizSet(context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		var quizSetCreateForm *dto.QuizSetCreateForm
		var username string = claims["UserName"].(string)

		err := c.BindJSON(&quizSetCreateForm)

		if err != nil {
			c.JSON(400, INVALID_REQUEST_BODY)
			return
		}

		newQuizSet := &models.QuizSet {
			QuizSetName: quizSetCreateForm.QuizSetName,
			TotalScore: quizSetCreateForm.TotalScore,
		}
		quizSetId, createError := context.Repositories.QuizSetRepository().Create(username, newQuizSet)

		if createError != nil {
			c.JSON(500, RETRY)
			return
		}

		tx, err := context.Repository.Master.Db.Begin()
		if err != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}
		for _, quiz := range quizSetCreateForm.Quizes {
			modelQuiz := &models.Quiz{
				QuizTitle: quiz.QuizTitle,
				QuizSetId: quizSetId,
				QuizContent: quiz.QuizContent,
				QuizAnswer: quiz.QuizAnswer,
				QuizType: quiz.QuizType,
			}
			err := context.Repositories.QuizRepository().Create(modelQuiz)

			if err != nil {
				_ = tx.Rollback()
				c.JSON(500, INTERNAL_SERVER_ERROR)
				return
			}
		}
		_ = tx.Commit()

	}
}

// @tags Quiz set
// @Summary 퀴즈셋을 삭제한다
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizsetId path string true "퀴즈 셋 고유 아이디"
// @Router /quizsets/quizset/{quizsetId} [DELETE]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string "INVALID_PATH_PARAMETER"
func DeleteQuizSet(context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		var username string = claims["UserName"].(string)
		quizsetId, err := strconv.ParseInt(c.Param("quizsetId"), 10, 64)

		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		users, getManagersErr := context.Repositories.QuizSetRepository().GetManagers(quizsetId)

		if getManagersErr != nil {
			c.JSON(401, UNAUTHORIZED)
			return
		}

		for _, user := range users {
			if user.UserName == username {
				err := context.Repositories.QuizSetRepository().Delete(quizsetId)
				if err != nil {
					c.JSON(500, INTERNAL_SERVER_ERROR)
					return
				}
				c.JSON(200, "ok")
				return
			}
		}
	}
}

// @tags Quiz set
// @Summary 퀴즈셋에 퀴즈를 추가한다.
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetId path string true "퀴즈를 추가하려는 퀴즈셋의 아이디"
// @Param quizInfo JSON body dto.QuizCreateForm true "퀴즈 정보"
// @Router /quizsets/quizset/{quizsetId}/quiz [POST]
// @Success 200 {string} string "성공"
// @Failure 400 {string} string "요청이 올바르지 않습니다."
func AddQuiz(context *web.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		quizSetId, err := strconv.ParseInt(c.Param("quizsetId"), 10, 64)

		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
		}

		var quizCreateForm *dto.QuizCreateForm

		bindError := c.BindJSON(&quizCreateForm)

		if bindError != nil {
			c.JSON(400, INVALID_REQUEST_HEADER)
			return
		}

		var newQuiz *models.Quiz = &models.Quiz{
			QuizSetId: quizSetId,
			QuizTitle: quizCreateForm.QuizTitle,
			QuizType: quizCreateForm.QuizType,
			QuizContent: quizCreateForm.QuizContent,
			QuizAnswer: quizCreateForm.QuizAnswer,
		}
		quizCreateError := context.Repositories.QuizRepository().Create(newQuiz)

		if quizCreateError != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}
		c.JSON(200, "ok")
		return
	}
}

// @tags Quiz set
// @Summary 퀴즈셋에 있는 퀴즈를 삭제한다
// @Description
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetId path string true "퀴즈를 삭제 하려는 퀴즈셋의 아이디"
// @Param quizId path string true "삭제 하려는 퀴즈의 아이디"
// @Router /quizsets/quizset/{quizSetId}/quiz/{quizId} [DELETE]
// @Success 200 {string} string "성공"
// @Failure 400 {string} string "요청이 올바르지 않습니다."
func DeleteQuizFromQuizSet(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		var parseIntErr error
		var err *models.AppError
		var quizId int64
		var quizSetId int64
		quizSetId, parseIntErr = strconv.ParseInt(c.Param("quizsetId"), 10, 64)
		quizId, parseIntErr = strconv.ParseInt(c.Param("quizId"), 10, 64)

		if parseIntErr != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		_, err = context.Repositories.QuizSetRepository().GetQuizSetsById(quizSetId)
		err = context.Repositories.QuizRepository().Delete(quizId)

		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
		}
	}
}

// @tags Quiz set
// @Summary 유저의 퀴즈셋에 있는 퀴즈를 강의의 퀴즈셋으로 가져온다
// @Description 퀴즈 셋 고유 아이디와 학수번호를 받아서 클래스의 퀴즈셋 목록에 추가한다.
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetId path string true "클래스에 불러오려는 퀴즈셋의 아이디"
// @Param classCode path string true "퀴즈를 추가하려는 강의의 학수번호"
// @Router /quizsets/quizset/{quizSetId}/class/{classCode} [POST]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string "요청이 올바르지 않습니다."
// @Failure 400 {string} string "CLASS_QUIZ_SET_ALREADY_EXISTS"
func LoadQuizSetToClass(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		var err *models.AppError
		var parseIntErr error
		var quizSetId int64
		var classCode string
		classCode = c.Param("classCode")
		quizSetId, parseIntErr = strconv.ParseInt(c.Param("quizsetId"), 10, 64)

		if parseIntErr != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		_, err = context.Repositories.QuizSetRepository().GetQuizSetsById(quizSetId)
		class, err := context.Repositories.ClassRepository().GetByClassCode(classCode)

		if err != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		result, err := context.Repositories.ClassQuizSetRepository().GetByQuizSetIdAndClassCode(quizSetId, classCode)

		if result == nil {
			if err == nil {
				c.JSON(400, "CLASS_QUIZ_SET_ALREADY_EXISTS")
				return
			} else {
				c.JSON(500, INTERNAL_SERVER_ERROR)
				return
			}
		}

		classQuizSet := models.ClassQuizSet {
			QuizSetId: quizSetId,
			ClassId: class.ClassId,
		}

		err = context.Repositories.ClassQuizSetRepository().Create(classQuizSet)

		if err != nil {
			c.JSON(500, INVALID_PATH_PARAMETER)
			return
		}
	}
}

// @tags Quiz set
// @Summary 클래스에 있는 퀴즈셋을 삭제한다
// @Description 퀴즈 셋 고유 아이디와 학수번호를 이용해서 클래스에서 퀴즈셋을 삭제한다.
// @Description 원본 퀴즈 셋은 삭제되지 않는다.
// @name get-string-by-int
// @Accept json
// @Product json
// @Param quizSetId path string true "강의 에서 삭제 하려는 퀴즈셋의 아이디"
// @Param classCode path string true "강의의 학수번호"
// @Router /quizsets/quizset/{quizSetId}/class/{classCode} [DELETE]
// @Success 200 {string} string "ok"
// @Failure 400 {string} string INVALID_PATH_PARAMETER
// @Failure 400 {string} string "CLASS_QUIZ_SET_NOT_EXISTS"
// @Failure 500 {string} string INTERNAL_SERVER_ERROR
func DeleteQuizSetFromClass(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		var err *models.AppError
		var parseIntErr error
		var quizSetId int64
		var classCode string
		classCode = c.Param("classCode")
		quizSetId, parseIntErr = strconv.ParseInt(c.Param("quizsetId"), 10, 64)

		if parseIntErr != nil {
			c.JSON(400, INVALID_PATH_PARAMETER)
			return
		}

		_, err = context.Repositories.ClassQuizSetRepository().GetByQuizSetIdAndClassCode(quizSetId, classCode)

		// Class quiz set 이 존재하지 않으면
		if err != nil {
			c.JSON(400, "CLASS_QUIZ_SET_NOT_EXISTS")
			return
		}

		// TODO cascading 처리 문제는?
		err = context.Repositories.ClassQuizSetRepository().DeleteQuizSetIdAndClassCode(quizSetId, classCode)

		if err != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}
	}
}

// @tags Quiz set
// @Summary 유저가 가진 모든 퀴즈 셋 채점 결과를 가져온다.
// @name get-string-by-int
// @Accept json
// @Product json
// @Param username path string true "채점 결과를 받아오려는 유저의 로그인 아이디(즉 이메일)"
// @Router /quizsets/result/users/{userName} [GET]
// @Success 200 {object} dto.GetQuizSetResults "채점된 퀴즈셋 목록(배열)"
// @Failure 400 {string} string INVALID_PATH_PARAMETER
// @Failure 500 {string} string INTERNAL_SERVER_ERROR
func GetQuizResults(context *web.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.Param("username")
		results, err := context.Repositories.QuizSetResultRepository().GetUserAllQuizSet(username)
		if err != nil {
			c.JSON(500, INTERNAL_SERVER_ERROR)
			return
		}
		c.JSON(404, results)
	}
}