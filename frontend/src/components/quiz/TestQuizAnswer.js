import React from 'react';
import {Form} from 'react-bootstrap';

const TestQuizAnswer = (props)=>{
    const {setTempAnswer, tempAnswer} = props;

    const handleChange = (e)=>{
        setTempAnswer(e.target.value);
    }
    return(
        <Form>
            <Form.Group>
                <Form.Control value={tempAnswer} onChange={(e)=>handleChange(e)}></Form.Control>
            </Form.Group>
        </Form>
    );
}

export default TestQuizAnswer;