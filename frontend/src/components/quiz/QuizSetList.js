import React from "react";
import {Button, Container} from "react-bootstrap";
import {Link} from "react-router-dom";
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

const QuizSets = quizsetdata.quizsets.map((quiz,index)=>
    <QuizSetItem id={quiz.id} title={quiz.title} />);


const QuizSetList = () =>{
    return (
        <Container className="quiz__container">
            {QuizSets}
            <Link to="/quiz/write"><Button>WRITE</Button></Link>
        </Container>
    )
}

export default QuizSetList;
