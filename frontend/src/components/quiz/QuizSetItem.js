import React from "react";
import {Container} from 'react-bootstrap';

const QuizSetItem = ({id, title, itemStyle}) => {
    return (
    <Container className={itemStyle}>
        <h2>{id}</h2>
        <p>{title}</p>
    </Container>
    )
}

export default QuizSetItem;