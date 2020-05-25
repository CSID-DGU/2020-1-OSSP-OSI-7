package repository

import (
	"database/sql"
	"github.com/go-gorp/gorp"
	_ "github.com/go-sql-driver/mysql"
	"oss/models"
)

type Repository struct {
	Master *gorp.DbMap
}

func NewRepository() *Repository {
	_, dbmap := initSqlStore()
	repo := &Repository {
		dbmap,

	}
	return repo
}

func initSqlStore() (*sql.DB, *gorp.DbMap) {
	db, err:= sql.Open("mysql",
		`root:root@tcp(localhost:3307)/dquiz_db`)
	if err != nil {
		print(err)
	}

	dbmap := &gorp.DbMap{Db: db, Dialect: gorp.MySQLDialect{Engine: "InnoDB", Encoding: "UTF8"}}

	err = dbmap.CreateTablesIfNotExists()

	_, err = db.Exec(`DROP TABLE user`)
	if err != nil {}

	_, err = db.Exec(`CREATE TABLE user (
			user_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
			student_code BIGINT NOT NULL,
			email VARCHAR(30) NOT NULL,
			nickname VARCHAR(20) NOT NULL,
			username VARCHAR(20) NOT NULL,
			password VARCHAR(20) NOT NULL,
			authority VARCHAR(15) NOT NULL,
			admin BOOL NOT NULL
		) DEFAULT CHARSET = UTF8`)
	if err != nil {

	}

	_, err = db.Exec(`DROP TABLE class`)
	_, err = db.Exec(`CREATE TABLE class (
    	class_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    	class_name VARCHAR(30) NOT NULL,
    	class_code VARCHAR(30) NOT NULL
	) DEFAULT CHARSET = UTF8`)
	if err != nil {}

	//_, err = db.Exec(`DROP TABLE class_user`)
	_, err = db.Exec(`CREATE TABLE class_user (
    	class_user_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    	class_id BIGINT NOT NULL,
    	user_id BIGINT NOT NULL,
    	FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE,
    	FOREIGN KEY (class_id) REFERENCES  class (class_id) ON DELETE CASCADE
	) DEFAULT CHARSET = UTF8`)
	if err != nil {}

	//_, err = db.Exec(`DROP TABLE class_admin`)
	_, err = db.Exec(`CREATE TABLE class_admin (
    	class_admin_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    	class_id BIGINT NOT NULL,
    	user_id BIGINT NOT NULL,
    	FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE,
    	FOREIGN KEY (class_id) REFERENCES  class (class_id) ON DELETE CASCADE
	) DEFAULT CHARSET = UTF8`)
	if err != nil {
	//	panic(err)
	}

	//_, err = db.Exec(`DROP TABLE quiz_set`)
	_, err = db.Exec(`CREATE TABLE quiz_set (
    	quiz_set_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    	user_id BIGINT NOT NULL,
    	quiz_set_name VARCHAR(30) NOT NULL,
    	total_score INT UNSIGNED NOT NULL,
    	FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
	) DEFAULT CHARSET = UTF8`)
	if err != nil {
		//	panic(err)
	}
	//_, _ = db.Exec(`DROP TABLE class_quiz_set`)
	_, err = db.Exec( `CREATE TABLE class_quiz_set (
    	class_quiz_set_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    	quiz_set_id BIGINT NOT NULL,
    	class_id BIGINT NOT NULL, 
    	FOREIGN KEY (quiz_set_id) REFERENCES quiz_set(quiz_set_id) ON DELETE CASCADE,
    	FOREIGN KEY (class_id) REFERENCES class(class_id) ON DELETE CASCADE 
	) DEFAULT CHARSET = UTF8`)
	if err != nil {
		//	panic(err)
	}
	//_, _ = db.Exec(`DROP TABLE quiz`)
	_, err = db.Exec(`CREATE TABLE quiz (
    	quiz_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    	quiz_set_id BIGINT NOT NULL,
    	quiz_title VARCHAR(256),
    	quiz_type VARCHAR(20),
    	quiz_content VARCHAR(4096), 
    	quiz_answer VARCHAR(1024),
    	FOREIGN KEY (quiz_set_id) REFERENCES quiz_set(quiz_set_id) ON DELETE CASCADE
	) DEFAULT CHARSET = UTF8`)
	if err != nil {
		//	panic(err)
	}
	_, _ = db.Exec(`DROP TABLE quiz_result`)
	_, err = db.Exec(`CREATE TABLE quiz_result (
    	quiz_result_id BIGINT NOT NULL AUTO_INCREMENT,
    	quiz_set_result_id BIGINT NOT NULL,  
    	user_id BIGINT NOT NULL,
    	quiz_id BIGINT NOT NULL,
    	FOREIGN KEY (quiz_set_result_id) REFERENCES quiz_set_result(quiz_set_result_id) ON DELETE CASCADE,
    	FOREIGN KEY (user_id) REFERENCES  user(user_id) ON DELETE CASCADE, 
    	FOREIGN KEY (quiz_id) REFERENCES  quiz(quiz_id) ON DELETE CASCADE
	) DEFAULT CHARSET = UTF8`)
	if err != nil {
		//	panic(err)
	}
	_, _ = db.Exec(`DROP TABLE quiz_set_result`)
	_, err = db.Exec(`CREATE TABLE quiz_set_result (
    	quiz_set_result_id BIGINT NOT NULL AUTO_INCREMENT,
    	class_quiz_set_id BIGINT NOT NULL, 
    	user_id BIGINT NOT NULL,
    	total_score INT UNSIGNED NOT NULL,
    	FOREIGN KEY (class_quiz_set_id) REFERENCES class_quiz_set(class_quiz_set_id) ON DELETE CASCADE,
    	FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE 
	) DEFAULT CHARSET = UTF8`)
	if err != nil {
		//	panic(err)
	}
	dbmap.AddTableWithName(models.User{}, "user")
	dbmap.AddTableWithName(models.Class{}, "class")
	dbmap.AddTableWithName(models.ClassUser{}, "class_user")
	dbmap.AddTableWithName(models.ClassAdmin{}, "class_admin")
	dbmap.AddTableWithName(models.QuizSet{}, "quiz_set")
	dbmap.AddTableWithName(models.ClassQuizSet{}, "class_quiz_set")
	dbmap.AddTableWithName(models.Quiz{}, "quiz");
	dbmap.AddTableWithName(models.QuizResult{}, "quiz_result")
	dbmap.AddTableWithName(models.QuizSetResult{}, "quiz_set_result")

	return db, dbmap
}


