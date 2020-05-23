import React, { useState, useEffect} from "react";
import { Button, Container, ButtonToolbar, ButtonGroup,Form, Row,Col } from "react-bootstrap";
import QuizList from "./QuizList";
import {useRecoilValue} from 'recoil';
import {currentUser} from '../atoms';


const QuizTemplate = () => {
    const [count, setCount] = useState(0);
    const [quizSetName, setQuizSetName] = useState("");
    const [classId, setClassId] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [validated, setValidated] = useState(false);

    const user = useRecoilValue(currentUser);
    
    const koreanDict = {"mul_choices":"객관식", "essay":"주관식", "short_answer":"단답형","binary":"OX형"};

    useEffect(()=>{
        addQuiz("mul_choices");
    },[]);

    const initiateState = (quizId, type) => {
        let quiz = {
            id: quizId,
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
        setQuizzes(quizzes.concat(initiateState(count,type)));
        setCount(count + 1);
    };

    const onRemove = (index) => {
        setQuizzes(quizzes.filter((quiz) => quiz.id !== index).map((quiz, index) => ({...quiz, id: index})));
        setCount(count - 1);
    };

    const onTypeChange = (quizId, type) => {
        setQuizzes(quizzes.map((quiz) => (quiz.id === quizId ? initiateState(quizId,type) : quiz)));
    };

    const addChoices = (quizId, data) =>{
        setQuizzes(quizzes.map((quiz)=>(quizId === quiz.id ? {...quiz, content:{description:quiz.content.description, choices:quiz.content.choices.concat(data)}}: quiz)));
    }


    const onChange = (e)=>{
        const targetName = e.target.name;

        if (targetName === "quizSetName"){
            setQuizSetName(e.target.value);
        }else if(targetName === "classId"){
            setClassId(e.target.value);
        } else {
            let data = {
                quizId: Number(e.target.getAttribute('quizId')),
            }
            if(targetName === "choice" || targetName === "description"){
                data['content'] = changeContent(e.target, targetName);
            }
            else {
                data[targetName] = e.target.value;
            }
            handleChange(data);
        }
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

        let answerList = quiz.answer.split(",").filter((an) => an !== String(choiceId)).map((an) => (Number(an) > choiceId ? String(an -1) : an));
        const answer = answerList.join(",");

        const changedChoices = quiz.content.choices.filter((c)=>c.id !== choiceId).map((c, index) => ({...c, id: index}));
        setQuizzes(quizzes.map((quiz)=>(quiz.id === quizId ? {...quiz, answer:answer,content:{description:quiz.content.description,choices:changedChoices}}: quiz)));        
    }

    const handleBlur = (e) => {
        const value = e.target.value;
        const quizId = Number(e.target.getAttribute("quizId"));
        const choiceId = Number(e.target.getAttribute("choiceId"));
        const choices = quizzes.filter((quiz)=>quiz.id === quizId)[0].content.choices;

        const isExist = choices.filter((c)=> c.id !== choiceId && value !== "" &&c.choice === value);
        console.log(isExist.length);
        if (isExist.length){
            alert("already exist choice please change");
            e.target.setCustomValidity("already exist");
        } else {
            e.target.setCustomValidity("");
        }
    }

    
    const selectAnswerChoice = (quizId, choiceId) =>{
        let joinAnswer;
        let answers = quizzes.filter((quiz)=>quiz.id === quizId)[0].answer;
        if(answers.length >= 1){
            let answerList = answers.split(',');
            if(answerList.indexOf(String(choiceId)) !== -1){
                joinAnswer = answerList.filter((an) => an !== String(choiceId)).join(",");
            } else {
                answerList.push(`${choiceId}`);
                joinAnswer = answerList.join(",");
            }
        } else{
            joinAnswer = `${choiceId}`
        }

        handleChange({quizId:quizId,answer:joinAnswer});
    }

    const onSubmit = (e)=>{
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
          console.log("good bye");

        } else {
            console.log("hello");
            const quizSet = {
                user: user,
                quizset_name: quizSetName,
                class_id: classId,
                quizzes:quizzes
            }
            console.log(JSON.stringify(quizSet));
        }
        setValidated(true);
    }

    const QuizBtn = ({quizType}) => (
        <ButtonGroup className="mr-2">
            <Button onClick={() => addQuiz(quizType)}>{koreanDict[quizType]}</Button>
        </ButtonGroup>
    );


    return (
        <Container  className="quiz__container">
        <Form noValidate validated={validated} onSubmit={onSubmit}>
            <Container>
                <h1>QUIZ 만들기</h1>
                <h3>TOTAL : {count}</h3>
                <Container>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">NAME</Form.Label>
                        <Col sm="4">
                            <Form.Control value={quizSetName} required name="quizSetName" onChange={(e)=>onChange(e)}></Form.Control>
                            <Form.Control.Feedback type="invalid">Please type Quiz name</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">CLASS_ID</Form.Label>
                        <Col sm="4">
                            <Form.Control value={classId} name="classId" required onChange={(e)=>onChange(e)} ></Form.Control>
                            <Form.Control.Feedback type="invalid">Please choose a class</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                </Container>
            </Container>
            <QuizList quizzes={quizzes} onRemove={onRemove} 
            onTypeChange={onTypeChange} addChoices={addChoices} 
            onChange={onChange} onRemoveChoice={onRemoveChoice}
            selectAnswerChoice={selectAnswerChoice}
            handleBlur={handleBlur} />
            <Container>
                <ButtonToolbar>
                    <QuizBtn quizType="mul_choices" />
                    <QuizBtn quizType="essay" />
                    <QuizBtn quizType="short_answer" />
                    <QuizBtn quizType="binary" />
                    <ButtonGroup >
                        <Button type="submit" variant="success">저장</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Container>
        </Form>
        </Container>
    );
};

export default QuizTemplate;
