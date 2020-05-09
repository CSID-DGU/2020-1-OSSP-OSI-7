import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import QuizForm from './QuizForm';




const Quiz = ()=>{
    const [count, setCount] = useState(1);
    const [quizzes, setQuizzes] = useState([]);

    const addQuiz = (quiz) =>{
        setQuizzes([...quizzes,""]);
    }

    return (
    <>
        <h1>
            Quiz
        </h1>
        <h2>{count}</h2>
        <Button onClick={(e)=>addQuiz(e)}>UP</Button>
        {
            quizzes.map((quiz,index)=>{
                return (
                    <QuizForm index={index}/>
                )
            })
        }
    </>
    );
}

export default Quiz;