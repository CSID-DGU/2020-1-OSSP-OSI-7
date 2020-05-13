import React, {useState} from 'react';
import {Form, Col} from 'react-bootstrap';
import styled from 'styled-components';
import {MdDelete} from 'react-icons/md';

const DeleteBtn = styled.span`
    position: absolute;
    text-align:center;
    top:4px;
    height:30px;
    width:20px;
    right:14px;
    color:#c62828;
    margin-left:auto;
    &:hover{
        cursor:pointer
    }

`


const ChoicesItem = (props) =>{
    const {choice, onChange, quizId, onRemoveChoice} = props;
    const [focus,setFocus] = useState(false);

    const placeholder = `choice ${choice.id+1}`

    return (
        <Form.Group as={Col} md={2}
            onMouseLeave={() => setFocus(false)}
            onMouseEnter={()=> setFocus(true)}>
            <Form.Control placeholder={placeholder} 
                name='choice' quizId={quizId} 
                value={choice.choice} choiceId={choice.id} 
                onChange={(e)=>onChange(e)}></Form.Control>
            {focus && (
                <DeleteBtn onClick={()=>{onRemoveChoice(quizId,choice.id)}}><MdDelete/></DeleteBtn>
            )}
        </Form.Group>
    );
}

export default ChoicesItem;