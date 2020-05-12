import React, {Fragment} from 'react';
import ChoiceItem from './ChoiceItem';
import {Button,Form, Col} from 'react-bootstrap';

const ChoicesList = (props) =>{
    const {choices, addChoices, quiz_id} = props;
    const choiceLength = choices.length;
    return (
        <Fragment>
            {choices.map((c)=><ChoiceItem choice={c.choice}/>)}
            <Form.Group as={Col}>
        <Button variant="success" onClick={()=>{addChoices(quiz_id, {id:choiceLength,choice:`choice ${choiceLength+1}`})}}>+</Button>
        </Form.Group>
        </Fragment>
    );
}

export default ChoicesList;