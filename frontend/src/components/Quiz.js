import React, { useState, useEffect } from "react";
import { Button, Container, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import QuizList from "./QuizList";
import AnswerForm from "./AnswerForm";

const Quiz = () => {
    const [count, setCount] = useState(0);
    const [quizzes, setQuizzes] = useState([]);

    const addQuiz = (type) => {
        let eachQuiz = {
            id: count,
            type: type,
            title: "",
            description: "",
            content:{
                answer:"",  
            },
        }
        if (type === "mul_choices") {
            eachQuiz.content.choices = [];
        }
        setQuizzes(
            quizzes.concat(eachQuiz)
        );
        setCount(count + 1);
    };

    const onRemove = (index) => {
        let modifiedArray = quizzes.filter((quiz) => quiz.id !== index).map((quiz, index) => ({ id: index, type: quiz.type }));
        setQuizzes(modifiedArray);
        setCount(count - 1);
    };

    const onTypeChange = (index, type) => {
        console.log(type);
        setQuizzes(quizzes.map((quiz) => (quiz.id === index ? { ...quiz, type: type } : quiz)));
    };

    return (
        <Container>
            <h1>Quiz</h1>
            <h2>TOTAL : {count}</h2>
            <QuizList quizzes={quizzes} onRemove={onRemove} onTypeChange={onTypeChange} AnswerForm={<AnswerForm/>}/>
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
