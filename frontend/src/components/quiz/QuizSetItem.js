import React from "react";
import {useHistory} from 'react-router-dom';
import {Container, Col,Row, Button, ButtonGroup} from 'react-bootstrap';


const QuizSetItem = ({quizset, user,auth,itemStyle}) => {
    const history = useHistory();
    return (
    <Container className={itemStyle}>
    <h2>{quizset.quiz_set_id}</h2>
    <h5>{quizset.quiz_set_name}</h5>
    <Row>
    <Col md={{span:6,offset:6}} className="quizItem__btn__container">
    <ButtonGroup>
    {
        quizset.quiz_set_author_name === user && auth &&
        <Button>수정하기</Button>
    }
    {
        !auth && 
        <Button onClick={()=>history.push(`/quiz/${quizset.quiz_set_id}`)}>퀴즈풀기</Button>
    }
    <Button onClick={()=>history.push(`/quiz/${quizset.quiz_set_id}/result`)}>결과보기</Button>
    </ButtonGroup>
    </Col>
    </Row>
    </Container>
    )
}

export default QuizSetItem;