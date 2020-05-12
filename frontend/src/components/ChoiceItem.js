import React from 'react';
import {Form, Col} from 'react-bootstrap';
import styled from 'styled-components';

const DeleteBtn = styled.span`
    position: absolute;
    text-align:center;
    top:4px;
    height:30px;
    width:20px;
    right:12px;
    margin-left:auto;
    z-index:2;

`



const ChoicesItem = (props) =>{
    const {choice, onChange, quizId} = props;
    const placeholder = `choice ${choice.id}`
    return (
        <Form.Group as={Col} md={2}>
        <Form.Control placeholder={placeholder} name='choice' index={quizId} value={choice.choice} choiceId={choice.id} onChange={(e)=>onChange(e)}>
        </Form.Control>
        <DeleteBtn>x</DeleteBtn>
        </Form.Group>
    );
}

export default ChoicesItem;