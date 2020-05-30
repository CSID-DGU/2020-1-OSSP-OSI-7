import React from 'react';
import QuizSetList from '../quiz/QuizSetList';
import {Container,Row,Col, Image} from 'react-bootstrap';

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
        <Row>
        <Col>
        <h3>퀴즈 목록</h3>
        <QuizSetList itemStyle={"profile__quiz__item"}/>
        </Col>
        </Row>
        </Container>
    )

}

export default ClassRoom;