import React from 'react';
import QuizSetList from '../quiz/QuizSetList';


const SolvedQuizList = () =>{

    return (
        <div>
        <h3>푼 퀴즈 목록</h3>
        <QuizSetList itemStyle={"profile__quiz__item"}/>
        </div>
    );
}


export default SolvedQuizList;