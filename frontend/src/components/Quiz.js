import React, { useState, useEffect} from "react";
import { Button, Container, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import QuizList from "./QuizList";

const Quiz = () => {
    const [count, setCount] = useState(0);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(()=>{
        addQuiz("mul_choices");
    },[]);

    const initiateState = (id, type) => {
        let quiz = {
            id: id,
            type: type,
            question: "",
            description: "",
            answer:"",  
        }
        if(type === 'mul_choices'){
                quiz.choices = [
                    {id:0,choice:""},
                    {id:1,choice:""},
                ];
        }
        return quiz;
    }
    
    const addQuiz = (type) => {
        setQuizzes(
            quizzes.concat(initiateState(count,type))
        );
        setCount(count + 1);
    };

    const onRemove = (index) => {
        setQuizzes(quizzes.filter((quiz) => quiz.id !== index).map((quiz, index) => ({...quiz, id: index})));
        setCount(count - 1);
    };

    const onTypeChange = (index, type) => {
        setQuizzes(quizzes.map((quiz) => (quiz.id === index ? initiateState(index,type) : quiz)));
    };

    const addChoices = (quizId, data) =>{
        setQuizzes(quizzes.map((quiz)=>(quizId === quiz.id ? {...quiz, choices:quiz.choices.concat(data)}: quiz)));
    }


    const onChange = (e)=>{
        let data = {
            quizId: Number(e.target.getAttribute('quizId')),
        }
        if(e.target.name === "choice"){
            data['choices'] = changedChoices(e.target);
        } else {
            data[e.target.name] = e.target.value;
        }
        handleChange(data)
    }

    const handleChange = (data)=>{
        const targetName= Object.keys(data)[1];
        setQuizzes(quizzes.map((quiz)=>(quiz.id == data.quizId ?{...quiz, [targetName]:data[targetName]}:quiz )));
    }

    const changedChoices= (target)=>{
        const quizId = target.getAttribute("quizId");
        const choiceId = target.getAttribute("choiceId");

        let quiz = quizzes.filter((quiz)=>quiz.id == quizId)[0];
        quiz.choices[choiceId] = {id:choiceId,choice:target.value};
        return quiz.choices
    }
    const onRemoveChoice = (quizId, choiceId) =>{
        let quiz = quizzes.filter((quiz)=>quiz.id == quizId)[0];
        const changedChoices = quiz.choices.filter((c)=>c.id !== choiceId).map((c, index) => ({...c, id: index}));
        setQuizzes(quizzes.map((quiz)=>(quiz.id == quizId ? {...quiz, choices:changedChoices}: quiz)));        
    }

    return (
        <Container>
            <Container>
                <h1>Quiz</h1>
                <h2>TOTAL : {count}</h2>
            </Container>
            <QuizList quizzes={quizzes} onRemove={onRemove} onTypeChange={onTypeChange} addChoices={addChoices} onChange={onChange} onRemoveChoice={onRemoveChoice}/>
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
