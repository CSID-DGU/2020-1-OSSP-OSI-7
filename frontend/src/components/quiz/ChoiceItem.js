import React, {useState, Fragment} from 'react';
import {Form, Col} from 'react-bootstrap';
import styled from 'styled-components';
import {MdDelete, MdCheck} from 'react-icons/md';

const InputBtn = styled.span`
    position: absolute;
    text-align:center;
    top:6px;
    height:30px;
    width:20px;
    margin-left:auto;
    &:hover{
        cursor:pointer;
    }
` 

const DeleteBtn = styled(InputBtn)`
    right:14px;
    color:#c62828;
`

const AnswerBtn = styled(InputBtn)`
    right: 34px;
    color:#2e7d32;
`


const ChoicesItem = (props) =>{
    const {choice, onChange, quizId, handleBlur, onRemoveChoice, selectAnswerChoice, isAnswer} = props;
    const [focus,setFocus] = useState(false);
    const [btnfocus,setBtnFocus] = useState(false);

    const placeholder = `choice ${choice.index+1}`

    const inputBackground = ()=>{
        if(btnfocus === "delete"){
            return 'delete__background';
        } else if(btnfocus ==="answer" || isAnswer > -1){
            return 'answer__background';
        }
    }

    return (
        <Form.Group as={Col} sm={2}
            onMouseLeave={() => setFocus(false)}
            onMouseEnter={()=> setFocus(true)}>
            <Form.Control placeholder={placeholder} 
                name='choice' quizId={Number(quizId)} 
                value={choice.choice} choiceId={choice.index} 
                onChange={(e)=>onChange(e)}
                className={inputBackground()}
                isAnswer={isAnswer} onBlur={handleBlur} required
                ></Form.Control>
            {focus && (
                <Fragment>
                <AnswerBtn 
                    onMouseLeave={() => setBtnFocus(false)}
                    onMouseEnter={()=> setBtnFocus("answer")}
                    onClick={()=>{selectAnswerChoice(quizId,choice.index)}}>
                    <MdCheck/>
                </AnswerBtn>
                <DeleteBtn onClick={()=>{onRemoveChoice(quizId,choice.index)}}
                    onMouseLeave={() => setBtnFocus(false)}
                    onMouseEnter={()=> setBtnFocus("delete")}>
                    <MdDelete/>
                </DeleteBtn>
                </Fragment>
            )}
        </Form.Group>
    );
}

export default ChoicesItem;