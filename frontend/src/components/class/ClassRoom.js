import React from 'react';
import QuizSetList from '../quiz/QuizSetList';
import {Container,Row,Col, Image, Form} from 'react-bootstrap';

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

const ClassRoom = ({classId}) =>{

    return(
        <Container className="quiz__container__no_border">
        <Row>
            <Col xs={4} md={3} lg={2}>
                <Image src="https://placekitten.com/300/300" fluid className="profile__img"></Image>
            </Col>

            <Col xs={8} md={9} lg={10}>
                <h3>형식언어 </h3>
                <h4>CSE-129313</h4>
                <p>eoifjaiowejfiojeoifajweiofawi</p>
            </Col>
        </Row>
        <hr className="profile__class__hr"/>
        <Form>
            <Form.Group>
                <Form.Control placeholder="search quiz"></Form.Control>
            </Form.Group>
        </Form>
        <Row>
        <Col>
        <h3>퀴즈 목록</h3>
        <QuizSetList itemStyle={"profile__quiz__item"} quizsets={quizsetdata}/>
        </Col>
        </Row>
        </Container>
    )

}

export default ClassRoom;