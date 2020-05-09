import React, {useState, useEffect} from 'react';
import {Button, Container} from 'react-bootstrap';
import QuizForm from './QuizForm';




const Quiz = ()=>{
    const [count, setCount] = useState(0);
    const [quizzes, setQuizzes] = useState([]);

    const addQuiz = (quiz) =>{
        setCount(count +1);
        setQuizzes([...quizzes,quiz]);
    }

    const removeQuiz = (index)=>{
        quizzes.splice(index,1);
        console.log(quizzes);
        setQuizzes([quizzes]);
        setCount(count-1);
    }



    return (
    <Container>
        <h1>
            Quiz
        </h1>
        <h2>TOTAL : {count}</h2>
        {
            quizzes.map((quiz,index)=>{
                console.log(count);
                return (
                    <QuizForm index={count} type={quiz.type} removeQuiz={removeQuiz}/>
                )
            })
        }
        <Container>
        <Button onClick={()=>{addQuiz({type:"mul_choices"})}}>객관식</Button>
        <Button onClick={()=>{addQuiz({type:"essay"})}}>주관식</Button>
        <Button onClick={()=>{addQuiz({type:"short_answer"})}}>단답형</Button>
        <Button onClick={()=>{addQuiz({type:"binary"})}}>OX형</Button>
        </Container>
    </Container>
    );
}

export default Quiz;