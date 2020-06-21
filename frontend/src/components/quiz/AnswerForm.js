import React, {Fragment} from 'react';
import {Form, Col} from 'react-bootstrap';
import ChoicesList from './ChoicesList';

const AnswerForm = (props) =>{
    const {addChoices, onChange, quiz, handleBlur, onRemoveChoice, selectAnswerChoice} = props;
    if(props.quiz.quiz_type === "MULTI"){
        return (
            <Fragment>
                <Form.Label  column sm="2">CHOICES</Form.Label>
                <Col sm="10">
                    <Form.Row>
                        <ChoicesList handleBlur={handleBlur} choices={quiz.quiz_content.choices} addChoices={addChoices}
                        onChange={onChange} quiz={quiz} onRemoveChoice={onRemoveChoice}
                        selectAnswerChoice={selectAnswerChoice}
                        />
                    </Form.Row>
                </Col>
            </Fragment>
            );
    }
    return (
        <Fragment>
            <Form.Label  column sm="2">ANSWER</Form.Label>
            <Col sm="10" className="quizitem__last__row">
            <Form.Control required name="quiz_answer" quizId={quiz.id} value={quiz.quiz_answer} onChange={(e)=>onChange(e)}></Form.Control>
            <Form.Control.Feedback type="invalid">Please type a answer</Form.Control.Feedback>
            </Col>
        </Fragment>
    )
}

export default AnswerForm;