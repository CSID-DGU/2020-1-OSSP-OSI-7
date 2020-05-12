import React from 'react';
import {Form, Col} from 'react-bootstrap';

const ChoicesItem = (props) =>{
    const {choice, onChange, quizId} = props;
    const placeholder = `choice ${choice.id}`
    return (
        <Form.Group as={Col} md={2}>
        <Form.Control placeholder={placeholder} name='choice' index={quizId} value={choice.choice} choiceId={choice.id} onChange={(e)=>onChange(e)}>
        </Form.Control>
        </Form.Group>
    );
}

export default ChoicesItem;