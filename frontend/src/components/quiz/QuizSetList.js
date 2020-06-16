import React, { Fragment, useState } from "react";
import QuizSetItem from './QuizSetItem';

const quizsetdata = {quizsets:
    [
        {
            id: 1,
            title: "hello world"
        },
        {
            id: 2,
            title: "hello world"
        },
        {
            id: 3,
            title: "hello world"
        },
        {
            id: 4,
            title: "hello world"
        },
        {
            id: 5,
            title: "hello world"
        },
        {
            id: 6,
            title: "hello world"
        }
    ]
}


const QuizSetList = ({itemStyle}) =>{
    const [quizset, setQuizSet] = useState(quizsetdata);

    return (
        <Fragment>
        {quizset.quizsets.map((quiz,index)=> <QuizSetItem id={quiz.id} title={quiz.title} itemStyle={itemStyle} />)}
        </Fragment>
    )
}

export default QuizSetList;
