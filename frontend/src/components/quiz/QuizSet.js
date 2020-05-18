import React, {useState} from 'react';
import {Container, Row,Col, ProgressBar, Button} from 'react-bootstrap';
import QuizSetForm from './QuizSetForm';

import {quizsetdata} from './quizsetdata';


const QuizSet = ({match}) => {
    const [current,setCurrent] = useState(1);
    const quizset = quizsetdata;
    const total = quizset.quizzes.length;
    const currentPercent = Math.round((current/total) * 100);
    const {quizSetId} = match.params;

    const isLast = current === total;

    return (
        <Container className="quiz__container">
            <Row className="mr__bottom__2">
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="align-text">{quizset.quizset_name}</h2>
                </Col>
            </Row>
            <Container className="mr__bottom__1">
                <Row className="mr__bottom__1">
                    <Col md={{ span: 6, offset: 3 }}>
                        <h4 className="align-text">{`Question ${current} of ${total}`}</h4>
                    </Col>
                </Row>
                <Col md={{span:10, offset:1}}>
                    <ProgressBar variant="success" animated  now={currentPercent}/>
                </Col>
            </Container>
            <Col md={{span:10, offset:1}} className="quiz__container">
                <QuizSetForm quiz={quizset.quizzes[current-1]}/>
            </Col>
            <Button className="mr-auto" onClick={()=>{isLast ? setCurrent(1):setCurrent(current+1) }}>Next</Button>
        </Container>
    )

}

export default QuizSet;