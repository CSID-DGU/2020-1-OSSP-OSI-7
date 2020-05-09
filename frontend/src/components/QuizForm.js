import React, {useState} from 'react';
import {Button} from 'react-bootstrap';

const QuizForm = (props)=>{
    const [id, setId] = useState(props.index);
    const [type, setType] = useState("mul_choices");
    const [question, setQuestion] = useState("");
    const quizType = (type)=>{
        if(type ==="mul_choices"){
        return(
            <h2>hello!!!!!!!!!</h2>
        );}else {
            return(<h3>nono</h3>);
        }
    }

    return(
        <>
        <h1>{type} - no{id}</h1>
        <input></input>
        {quizType(type)}
        <Button onClick={(e)=>{setType("mul_choices")}}>객관식</Button>
        <Button onClick={()=>{setType("essay")}}>주관식</Button>
        <Button onClick={()=>{setType("short_answer")}}>단답형</Button>
        <Button onClick={(e)=>{setType("binary");console.log(e.text)}}>OX형</Button>

        </>
        );
}


export default QuizForm;
