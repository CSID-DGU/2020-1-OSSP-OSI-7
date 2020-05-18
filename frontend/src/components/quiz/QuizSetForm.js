import React from 'react';
import {Container} from 'react-bootstrap';
import styled from 'styled-components';

const QuizH5 = styled.h5`
    color: #ACACAC;
`;


const QuizSetForm = ({quiz}) =>{

    return (
        <Container>
            <QuizH5>Select an answer</QuizH5>
            <p>{quiz.question}</p>
        </Container>
    )
}

export default QuizSetForm;