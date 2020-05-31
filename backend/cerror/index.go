package cerror

const (
	DQUIZ_DB_OPERATION_ERROR = "DB_OPERATION_ERROR"
	DQUIZ_REDIS_CONN_ERROR = "REDIS_CONN_ERROR"
	DQUIZ_REDIS_OP_FAIL = "REDIS_OP_FAIL"
	DQUIZ_DB_ERROR = "DB_ERROR"
)

func BuildRedisGetFailMsg(key string) string {
	return DQUIZ_REDIS_OP_FAIL + " => key was " + key
}
