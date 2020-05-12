import React, {Fragment} from 'react';
import {Form} from 'react-bootstrap';
import ChoicesList from './ChoicesList';

const AnswerForm = (props) =>{
    const {addChoices} = props;
    if(props.quiz.type === "mul_choices"){
        return (
            <Fragment>
            <Form.Label>Answer - {props.quiz.type}</Form.Label>
            <Form.Row>
            <ChoicesList choices={props.quiz.content.choices} addChoices={addChoices} quiz_id={props.quiz.id}/>
            </Form.Row>
            </Fragment>
            );
    }
    return (
        <Form.Group>
            <Form.Label>Answer {props.quiz.type}</Form.Label>
            <Form.Control></Form.Control>
        </Form.Group>
    )
}

export default AnswerForm;