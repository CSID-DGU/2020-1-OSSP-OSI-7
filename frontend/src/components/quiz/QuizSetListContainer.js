import React from 'react';
import QuizSetList from './QuizSetList';
import {Link} from 'react-router-dom';
import {Container, Button} from 'react-bootstrap';

const quizsetdata = {quizsetsList:
    [
        {
            quiz_set_author_name:"pop",
            quiz_set_id: 1,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop",
            quiz_set_id: 2,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop",
            quiz_set_id: 3,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop",
            quiz_set_id: 4,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop",
            quiz_set_id: 5,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop",
            quiz_set_id: 6,
            quiz_set_name: "hello world",
            quizzes:""
        }
    ]
}

const QuizSetListContainer = () => {
    return (
        <Container className="quiz__container">
            <QuizSetList itemStyle={"quiz__container"} quizsets={quizsetdata.quizsetsList}/>
            <Link to="/create/"><Button>WRITE</Button></Link>
            <Link to="/quiz/1"><Button>quiz gogo</Button></Link>
        </Container>
    )
}

export default QuizSetListContainer