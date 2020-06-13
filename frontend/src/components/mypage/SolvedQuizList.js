import React from 'react';
import QuizSetList from '../quiz/QuizSetList';


const quizsetdata = {quizsetsList:
    [
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 1,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"yongsk0066@dongguk.edu",
            quiz_set_id: 2,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"testuser@dongguk.edu",
            quiz_set_id: 3,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 4,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 5,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 6,
            quiz_set_name: "hello world",
            quizzes:""
        }
    ]
}

const SolvedQuizList = () =>{
    // api 추가 예정 퀴즈 받아오기
    return (
        <div>
        <h3>푼 퀴즈 목록</h3>
        <QuizSetList itemStyle={"profile__quiz__item"} quizsets={quizsetdata}/>
        </div>
    );
}


export default SolvedQuizList;