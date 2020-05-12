import React, { useState, useEffect} from "react";
import { Button, Container, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import QuizList from "./QuizList";

const Quiz = () => {
    const [count, setCount] = useState(0);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(()=>{
        addQuiz("mul_choices");
    },[]);
    
    const addQuiz = (type) => {
        setQuizzes(
            quizzes.concat(initiateState(count,type))
        );
        setCount(count + 1);
    };

    const onRemove = (index) => {
        let modifiedArray = quizzes.filter((quiz) => quiz.id !== index).map((quiz, index) => ({...quiz, id: index}));
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
            question: "",
            description: "",
            content:{
                answer:"",  
            },
        }

        if(type === 'mul_choices'){
                quiz.content.choices = [
                    {id:0,choice:""},
                    {id:1,choice:""},
                ];
        }
        
        return quiz;
    }

    const onChange = (e)=>{
        let data = {
            index: Number(e.target.getAttribute('index')),
        }
        if(e.target.name === "choice"){
            data['content'] = changedChoices(e.target);
        }

        if(e.target.name === "answer"){
            data['content'] = {answer:e.target.value};
        } else {
            data[e.target.name] = e.target.value;
        }
        handleChange(data)
    }

    const handleChange = (data)=>{
        const targetName= Object.keys(data)[1];
        setQuizzes(quizzes.map((quiz)=>(quiz.id == data.index ?{...quiz, [targetName]:data[targetName]}:quiz )));
    }

    const changedChoices= (target)=>{
        const quizId = target.getAttribute("index");
        const index = target.getAttribute("choiceId");
        let content = quizzes.filter((quiz)=>quiz.id == quizId)[0].content;
        content.choices[index] = {id:index,choice:target.value};
        return content
    }
    const onRemoveChoice = (quizId, choiceId) =>{
        // id 초기화 해줘야함
        let quiz = quizzes.filter((quiz)=>quiz.id == quizId)[0];
        const changedChoices = {content:{
            answer:quiz.content.answer,
            choices:quiz.content.choices.filter((c)=>c.id !== choiceId)}}
        console.log(changedChoices);
        setQuizzes(quizzes.map((quiz)=>(quiz.id == quizId ? {...quiz, content:changedChoices.content}: quiz)));        
    }

    return (
        <Container>
            <h1>Quiz</h1>
            <h2>TOTAL : {count}</h2>
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
