import React, {Fragment} from 'react';
import ChoiceItem from './ChoiceItem';
import {Button,Form, Col} from 'react-bootstrap';

const ChoicesList = (props) =>{
    const {choices, addChoices, quiz, onChange, onRemoveChoice} = props;    
    return (
        <Fragment>
            {choices.map((c)=><ChoiceItem onChange={onChange} choice={c} quizId={quiz.id} onRemoveChoice={onRemoveChoice}/>)}
        <Form.Group as={Col}>
        <Button variant="success" onClick={()=>{addChoices(quiz.id, {id:choices.length, choice:""})}}>+</Button>
        </Form.Group>
        </Fragment>
    );
}

export default ChoicesList;