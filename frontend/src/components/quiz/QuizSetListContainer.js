import React from 'react';
import QuizSetList from './QuizSetList';
import {Link} from 'react-router-dom';
import {Container, Button} from 'react-bootstrap';

const QuizSetListContainer = () => {
    return (
        <Container className="quiz__container">
            <QuizSetList itemStyle={"quiz__container"}/>
            <Link to="/create/"><Button>WRITE</Button></Link>
            <Link to="/quiz/1"><Button>quiz gogo</Button></Link>
        </Container>
    )
}

export default QuizSetListContainer