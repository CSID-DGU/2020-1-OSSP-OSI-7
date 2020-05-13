import React, {Fragment, useState} from 'react';
import ChoiceItem from './ChoiceItem';
import {Button,Form, Col} from 'react-bootstrap';

const ChoicesList = (props) =>{
    const {choices, addChoices, quiz, onChange, onRemoveChoice} = props;
    
    const [count, setCount] = useState(2);
    
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