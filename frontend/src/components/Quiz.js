import React, { useState} from "react";
import { Button, Container, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import QuizList from "./QuizList";

const Quiz = () => {
    const [count, setCount] = useState(0);
    const [quizzes, setQuizzes] = useState([]);

    const addQuiz = (type) => {
        setQuizzes(
            quizzes.concat(initiateState(count,type))
        );
        setCount(count + 1);
    };

    const onRemove = (index) => {
        let modifiedArray = quizzes.filter((quiz) => quiz.id !== index).map((quiz, index) => ({ id: index, type: quiz.type }));
        setQuizzes(modifiedArray);
        setCount(count - 1);
    };

    const onTypeChange = (index, type) => {
        setQuizzes(quizzes.map((quiz) => (quiz.id === index ? initiateState(index,type) : quiz)));
    };

    const addChoices = (quiz_id, data) =>{
        setQuizzes(quizzes.map((quiz)=>(quiz_id === quiz.id ? {...quiz, content:{answer:quiz.content.answer,choices:quiz.content.choices.concat(data)}}: quiz)));
    }

    const initiateState = (id, type) => {
        let quiz = {
            id: id,
            type: type,
            title: "",
            description: "",
            content:{
                answer:"",  
            },
        }

        if(type === 'mul_choices'){
                quiz.content.choices = [
                    {id:0,choice:"choice 1"},
                    {id:1,choice:"choice 2"},
                ];
        }
        
        return quiz;
    }

    return (
        <Container>
            <h1>Quiz</h1>
            <h2>TOTAL : {count}</h2>
            <QuizList quizzes={quizzes} onRemove={onRemove} onTypeChange={onTypeChange} addChoices={addChoices}/>
            <Container>
                <ButtonToolbar>
                    <ButtonGroup className="mr-2">
                        <Button onClick={() => addQuiz("mul_choices")}>객관식</Button>
                    </ButtonGroup>
                    <ButtonGroup className="mr-2">
                        <Button onClick={() => addQuiz("essay")}>주관식</Button>
                    </ButtonGroup>
                    <ButtonGroup className="mr-2">
                        <Button onClick={() => addQuiz("short_answer")}>단답형</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button onClick={() => addQuiz("binary")}>OX형</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Container>
        </Container>
    );
};

export default Quiz;