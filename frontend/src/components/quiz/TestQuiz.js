import React, {useState} from 'react';
import {Container, Row,Col, ProgressBar, Button, Form} from 'react-bootstrap';
import TestQuizHeader from './TestQuizHeader';
import TestQuizChoice from './TestQuizChoice';

import {quizsetdata} from './quizsetdata';


const TestQuiz = ({match}) => {
    const [current,setCurrent] = useState(1);
    const [answers, setAnswers] = useState([]);

    const quizset = quizsetdata;
    const total = quizset.quizzes.length;
    const currentPercent = Math.round((current / total) * 100);
    const {quizSetId} = match.params;

    const isLast = current === total;
    const currentQuiz = quizset.quizzes[current-1]

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
                <TestQuizHeader quiz={currentQuiz}/>
                <Container>
                {currentQuiz.type ==="mul_choices" ? 
                    (
                        currentQuiz.content.choices.map((c)=>
                        <TestQuizChoice choice = {c}/>)
                    ) :
                    (
                        <Form>
                            <Form.Group>
                            <Form.Control>
                            </Form.Control>
                            </Form.Group>
                        </Form>


                    )
                }
                <Button block onClick={()=>{isLast ? setCurrent(1):setCurrent(current+1) }}>Next</Button>
                </Container>
            </Col>
        </Container>
    )

}

export default TestQuiz;