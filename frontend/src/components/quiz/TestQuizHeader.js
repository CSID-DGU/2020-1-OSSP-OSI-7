import React from 'react';
import {Container, Image} from 'react-bootstrap';
import styled from 'styled-components';

const QuizH5 = styled.h5`
    color: #ACACAC;
`;


const TestQuizHeader = ({quiz}) =>{

    return (
        <Container  className="mr__bottom__t1" >
            <QuizH5>Select an answer</QuizH5>
            <p>{quiz.question}</p>
            {quiz.content.images &&
                <Image src={quiz.content.images[0]} fluid/>
            }
        </Container>
    )
}

export default TestQuizHeader;