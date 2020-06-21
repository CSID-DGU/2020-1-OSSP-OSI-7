import React, { useState, useEffect, Fragment} from "react";
import { Button, Container, ButtonToolbar, ButtonGroup,Form, Row,Col } from "react-bootstrap";
import QuizList from "./QuizList";
import CenteredModal from '../common/CenteredModal';
import QuizCreateModal from './QuizCreateModal';
import {useRecoilValue, useRecoilState} from 'recoil';
import {currentUser, modalShow} from '../atoms';
import {quizSubmit} from '../../lib/api/quiz';
import Base64 from '../../lib/Base64';
import {useHistory} from 'react-router-dom';


const QuizTemplate = ({match}) => {
    const [count, setCount] = useState(0);
    const [quizSetName, setQuizSetName] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [validated, setValidated] = useState(false);
    const [modalOn, setModalShow] = useRecoilState(modalShow);

    const history = useHistory();
    const user = useRecoilValue(currentUser);
    
    const koreanDict = {"MULTI":"객관식", "SHORT":"주관식", "short_answer":"단답형","binary":"OX형"};

    const unloadEvent =  (e)  => {
        let confirmationMessage = '정말 닫으시겠습니까?'
        e.returnValue = confirmationMessage    // Gecko, Trident, Chrome 34+
        return confirmationMessage             // Gecko, WebKit, Chrome < 34
        }

    useEffect(()=>{
        addQuiz("MULTI");
        window.addEventListener('beforeunload',unloadEvent);
            return () => {
                window.removeEventListener("beforeunload",unloadEvent);
              }    
    },[]);
            
    const initiateState = (quizId, type) => {
        let quiz = {
            id: quizId,
            quiz_type: type,
            quiz_title: "",
            quiz_answer:"",
            quiz_content:{
            }  
        }
        if(type === 'MULTI'){
                quiz.quiz_content.choices = [
                    {index:0,choice:""},
                    {index:1,choice:""},
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
        setQuizzes(quizzes.map((quiz)=>(quizId === quiz.id ? {...quiz, quiz_content:{choices:quiz.quiz_content.choices.concat(data)}}: quiz)));
    }


    const onChange = (e)=>{
        const targetName = e.target.name;

        if (targetName === "quizSetName"){
            setQuizSetName(e.target.value);
        } else {
            let data = {
                quizId: Number(e.target.getAttribute('quizId')),
            }
            if(targetName === "choice"){
                data['quiz_content'] = changeContent(e.target, targetName);
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
        let content = quizzes.filter((quiz)=>quiz.id === quizId)[0].quiz_content;
        
        if(contentType === "choice"){
            const choiceId = Number(target.getAttribute("choiceId"));
            content.choices[choiceId] = {index:choiceId,choice:target.value};
        }

        return content
    }
    const onRemoveChoice = (quizId, choiceId) =>{
        let quiz = quizzes.filter((quiz)=>quiz.id === quizId)[0];

        let answerList = quiz.quiz_answer.split(",").filter((an) => an !== String(choiceId)).map((an) => (Number(an) > choiceId ? String(an -1) : an));
        const answer = answerList.join(",");

        const changedChoices = quiz.quiz_content.choices.filter((c)=>c.index !== choiceId).map((c, index) => ({...c, index: index}));
        setQuizzes(quizzes.map((quiz)=>(quiz.id === quizId ? {...quiz, quiz_answer:answer,quiz_content:{choices:changedChoices}}: quiz)));        
    }

    const handleBlur = (e) => {
        const value = e.target.value;
        const quizId = Number(e.target.getAttribute("quizId"));
        const choiceId = Number(e.target.getAttribute("choiceId"));
        const choices = quizzes.filter((quiz)=>quiz.id === quizId)[0].quiz_content.choices;

        const isExist = choices.filter((c)=> c.index !== choiceId && value !== "" &&c.choice === value);
        if (isExist.length){
            alert("already exist choice please change");
            e.target.setCustomValidity("already exist");
        } else {
            e.target.setCustomValidity("");
        }
    }

    
    const selectAnswerChoice = (quizId, choiceId) =>{
        let joinAnswer;
        let answers = quizzes.filter((quiz)=>quiz.id === quizId)[0].quiz_answer;
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

        handleChange({quizId:quizId,quiz_answer:joinAnswer});
    }

    const removeContent= (type, content)=>{
        if(type === "MULTI") {
            return content;
        }else{
            return "";
        }
    }

    const makeQuiz2String = (quiz, index) =>{
        return {
            quiz_type: quiz.quiz_type,
            quiz_title: quiz.quiz_title,
            quiz_score: Math.pow(2,index),
            quiz_content: removeContent(quiz.quiz_type, Base64.encode(JSON.stringify(quiz.quiz_content))),
            quiz_answer: quiz.quiz_answer,
        }
    }

    const makePayload = (quizzes)=>{
        let result_quizzes = [];
        quizzes.map((q, index)=>{result_quizzes = result_quizzes.concat(makeQuiz2String(q, index))});
        return result_quizzes;
    }

    const onSubmit = (e)=>{
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
        } else {
            e.preventDefault();
            e.stopPropagation();
            const payload_quizzes = makePayload(quizzes);
            const quizSet = {
                quiz_set_author_name: user,
                quiz_set_name: quizSetName,
                quizzes:payload_quizzes,
                total_score: Math.pow(2,payload_quizzes.length)-1
            }
            quizSubmit(JSON.stringify(quizSet))
            .then((res)=>setModalShow(true))
            .catch((e)=>console.log(e));
            // api 추가 예정 퀴즈 생성하기
        }
        setValidated(true);
    }


    const QuizBtn = ({quizType}) => (
        <ButtonGroup className="mr-2">
            <Button onClick={() => addQuiz(quizType)}>{koreanDict[quizType]}</Button>
        </ButtonGroup>
    );


    return (
        <Fragment>
        <Container  className="quiz__container">
        <Form noValidate validated={validated} onSubmit={onSubmit}>
            <Container>
                <h1>QUIZ 만들기</h1>
                <h3>TOTAL : {count}</h3>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">QUIZ 이름</Form.Label>
                        <Col sm="4">
                            <Form.Control value={quizSetName} required name="quizSetName" onChange={(e)=>onChange(e)}></Form.Control>
                            <Form.Control.Feedback type="invalid">Please type Quiz name</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
            </Container>
            <QuizList quizzes={quizzes} onRemove={onRemove} 
            onTypeChange={onTypeChange} addChoices={addChoices} 
            onChange={onChange} onRemoveChoice={onRemoveChoice}
            selectAnswerChoice={selectAnswerChoice}
            handleBlur={handleBlur} />
            <div className="quiz__btn__container">
                <ButtonToolbar>
                    <QuizBtn quizType="MULTI" />
                    <QuizBtn quizType="SHORT" />
                    <ButtonGroup >
                        <Button type="submit" variant="success">저장</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        </Form>
        </Container>
        <CenteredModal
            show={modalOn}
            onHide={async ()=>{await setModalShow(false); await history.push('/mypage'); }}
        >
        <QuizCreateModal

        />
        </CenteredModal>

        </Fragment>
    );
};

export default QuizTemplate;
