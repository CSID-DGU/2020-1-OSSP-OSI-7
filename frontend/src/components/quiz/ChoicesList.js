import React, {Fragment} from 'react';
import ChoiceItem from './ChoiceItem';
import {Button,Form, Col} from 'react-bootstrap';

const ChoicesList = (props) =>{
    const {choices, addChoices, handleBlur, quiz, onChange, onRemoveChoice, selectAnswerChoice} = props;   
    
    const answers = quiz.answer.split(",");

    return (
        <Fragment>
            {choices.map((c)=><ChoiceItem handleBlur={handleBlur} onChange={onChange} isAnswer={answers.indexOf(String(c.id))}choice={c} quizId={quiz.id} selectAnswerChoice={selectAnswerChoice} onRemoveChoice={onRemoveChoice}/>)}
        <Form.Group as={Col}>
        <Button variant="success" onClick={()=>{addChoices(quiz.id, {id:choices.length, choice:""})}}>+</Button>
        </Form.Group>
        </Fragment>
    );
}

export default ChoicesList;