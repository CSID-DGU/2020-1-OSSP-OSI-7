import React from "react";
import {Container} from 'react-bootstrap';

const QuizSetItem = ({id, title}) => {
    return (
    <Container className="quiz__container">
        <h2>{id}</h2>
        <p>{title}</p>
    </Container>
    )
}

export default QuizSetItem;