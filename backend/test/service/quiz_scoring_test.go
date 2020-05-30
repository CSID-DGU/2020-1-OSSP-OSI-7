package service

import (
	"fmt"
	"github.com/go-playground/assert/v2"
	"github.com/gomodule/redigo/redis"
	"github.com/rafaeljusto/redigomock"
	"oss/service"
	"testing"
	"time"
)

type Foo struct {
	ch chan int
}

var foo *Foo = &Foo{
	ch: make(chan int),
}

func TestScheduleQuizScoringService(t *testing.T) {
	//ch := make(chan int)
	go service.ScheduleQuizSetScoring(foo.ch)
	for i := 0 ; i < 11; i++ {
		foo.ch <- i
	}
	for  {
		println("Good")
		time.Sleep(1000)
		foo.ch <- 10
	}
}
func TestQuizSetScoring(t *testing.T) {
	/*
	quizSetForScoring := &service.QuizSetForScoring {
		ClassQuizSetId: 1,

	}
	service.QuizSetScoring()

	 */
}

type Person struct {
	Name string `redis:"name"`
	Age  int    `redis:"age"`
}



func RetrievePerson(conn redis.Conn, id string) (Person, error) {
	var person Person

	values, err := redis.Values(conn.Do("HGETALL", fmt.Sprintf("quizScoring:%s", id)))
	if err != nil {
		return person, err
	}

	err = redis.ScanStruct(values, &person)
	return person, err
}

func TestQuizScoring(t *testing.T) {
	conn := redigomock.NewConn()
	cmd := conn.Command("HGETALL", "person:1").ExpectMap(map[string]string{
		"name": "Mr. Johson",
		"age":  "42",
	})
	//service.QuizScoring()
	person, err := RetrievePerson(conn, "1")
	if err != nil {
		fmt.Println(err)
		return
	}

	assert.Equal(t, person.Age, 42)

	if conn.Stats(cmd) != 1 {
		fmt.Println("Command was not used")
		return
	}
}