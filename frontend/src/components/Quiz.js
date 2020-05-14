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
            answer:"",
            content:{
                description: "",

            }  
        }
        if(type === 'mul_choices'){
                quiz.content.choices = [
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
        setQuizzes(quizzes.map((quiz)=>(quizId === quiz.id ? {...quiz, content:{description:quiz.content.description, choices:quiz.content.choices.concat(data)}}: quiz)));
    }


    const onChange = (e)=>{
        const targetName = e.target.name;
        let data = {
            quizId: Number(e.target.getAttribute('quizId')),
        }
        if(targetName === "choice" || targetName === "description"){
            data['content'] = changeContent(e.target, targetName);
        }
        else {
            data[targetName] = e.target.value;
        }
        handleChange(data)
    }

    const handleChange = (data)=>{
        const targetName= Object.keys(data)[1];
        setQuizzes(quizzes.map((quiz)=>(quiz.id === data.quizId ?{...quiz, [targetName]:data[targetName]}:quiz )));
    }

    const changeContent= (target, contentType)=>{
        const quizId = Number(target.getAttribute("quizId"));
        let content = quizzes.filter((quiz)=>quiz.id === quizId)[0].content;
        
        if(contentType === "choice"){
            const choiceId = Number(target.getAttribute("choiceId"));
            content.choices[choiceId] = {id:choiceId,choice:target.value};
        }else if(contentType === "description"){
            content.description = target.value;
        }

        return content
    }
    const onRemoveChoice = (quizId, choiceId) =>{
        let quiz = quizzes.filter((quiz)=>quiz.id === quizId)[0];
        const changedChoices = quiz.content.choices.filter((c)=>c.id !== choiceId).map((c, index) => ({...c, id: index}));
        setQuizzes(quizzes.map((quiz)=>(quiz.id === quizId ? {...quiz, content:{description:quiz.content.description,choices:changedChoices}}: quiz)));        
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
