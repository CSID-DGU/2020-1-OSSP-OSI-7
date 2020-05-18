import React from 'react';
import {Button,Col} from 'react-bootstrap';
import styled from 'styled-components';

const ChoiceItem = styled.div`
    color: #707070;
    margin-bottom: 0.5rem;
    border-color:#E2E2E2;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 1px solid #E2E2E2;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    &:hover{
        background-color: #3caf57;
        color: #fff;

    }

`;


const QuizSetChoice = ({choice}) => {

    return (
        <ChoiceItem as={Col} md={12}>
            {choice.choice}
        </ChoiceItem>
    )
}

export default QuizSetChoice;