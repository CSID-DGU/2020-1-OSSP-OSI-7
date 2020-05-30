package api

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"oss/dto"
	"time"
)

func classPayload(data interface{}) jwt.MapClaims {
	if v, ok := data.(*dto.User); ok {
		return jwt.MapClaims{
			identityKey : v.UserName,
		}
	}
	return jwt.MapClaims{}
}

func classIdentifyHandler(c *gin.Context) interface{} {
	claims := jwt.ExtractClaims(c)
	return &dto.User{
		UserName: claims[identityKey].(string),
	}
}

func classAuthenticator (c *gin.Context) (interface{}, error) {
	var loginVals dto.Login
	if err := c.ShouldBind(&loginVals); err != nil {
		return "", jwt.ErrMissingLoginValues
	}
	userID := loginVals.Username
	password := loginVals.Password

	result, err := App.Repositories.UserRepository().GetByUserName(userID)

	if err != nil {
		return nil, jwt.ErrFailedAuthentication
	}

	if (result.Password == password) {
		return &dto.User{
			UserId: result.UserId,
			NickName: result.NickName,
			UserName:  result.UserName,
		}, nil
	}

	return nil, jwt.ErrFailedAuthentication
}

func classAuthorizator (data interface{}, c *gin.Context) bool {
	if user, ok := data.(*dto.User); ok {
		rootPath := "/class/"
		method := c.Request.Method
		path := c.FullPath()
		path = path[len(rootPath):]
		if user != nil {}

		if method != "" {}
		return true
	}
	return false
}

func classUnAuthorized (c *gin.Context, code int, message string) {
	c.JSON(code, gin.H{
		"code":    code,
		"message": message,
	})
}

func getClassAuthMiddleware() (*jwt.GinJWTMiddleware, error){
	return jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "test zone",
		Key:         []byte("secret key"),
		Timeout:     time.Hour,
		MaxRefresh:  time.Hour,
		IdentityKey: identityKey,
		PayloadFunc: classPayload,
		IdentityHandler: classIdentifyHandler,
		Authenticator: classAuthenticator,
		Authorizator: classAuthorizator,
		Unauthorized: classUnAuthorized,
		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		// - "param:<name>"
		TokenLookup: "header: Authorization, query: token, cookie: jwt",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",

		// TokenHeadName is a string in the header. Default value is "Bearer"
		TokenHeadName: "Bearer",

		// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.
		TimeFunc: time.Now,
	});
}