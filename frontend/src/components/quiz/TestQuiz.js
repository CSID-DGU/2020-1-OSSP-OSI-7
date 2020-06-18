import React, {useState, useEffect, Fragment} from 'react';
import {Container, Row,Col, ProgressBar, Button} from 'react-bootstrap';
import TestQuizHeader from './TestQuizHeader';
import TestQuizChoice from './TestQuizChoice';
import TestQuizAnswer from './TestQuizAnswer';
import TestQuizResult from './TestQuizResult';
import QuizModal from './QuizModal';
import {quizDetail} from '../../lib/api/quiz';

import {quizsetdata} from './quizsetdata';

const useBeforeFirstRender  = (f) => {
  const [hasRendered, setHasRendered] = useState(false)
  useEffect(() => setHasRendered(true), [hasRendered])
  if (!hasRendered) {
    f()
  }
}


const TestQuiz = ({match, location}) => {
    const [current,setCurrent] = useState(1);
    const [answers, setAnswers] = useState([]);
    const [check,setCheck] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [tempAnswer, setTempAnswer] = useState("");
    const [tempChoice, setTempChoice] = useState([]);
    const [quizset, setQuizSet] = useState(location.state.quizset);

    let total = quizset.quizzes.length;
    const currentPercent = Math.round((current / total) * 100);
    const {quizSetId} = match.params;

    const isLast = current === total+1;
    let currentQuiz = quizset.quizzes[current-1];

    useEffect(()=>{
        setTempAnswer(tempChoice.join(","));
    }, [tempChoice])

    useEffect(()=>{
        tempAnswer === "" ? setCheck(false) : setCheck(true);
    }, [tempAnswer])

    const handleNext = (e) =>{
        if(!check){
            setModalShow(true);
        } else {
            setAnswers(answers.concat(tempAnswer));
            setCurrent(current+1);
            setTempAnswer("");
            setTempChoice([]);
            setCheck(false);
        }
    }

    const onClick = (choiceId, select) =>{
        if(!select){
            setTempChoice(tempChoice.concat(choiceId));
        } else {
            setTempChoice(tempChoice.filter((c)=> c !== choiceId));
        }
    }
    return (   
        <Container className="quiz__container">
            {!isLast ? (
                <Fragment>
                <Row className="mr__bottom__t1">
                    <Col md={{ span: 6, offset: 3 }}>
                        <h2 className="align-text">{quizset.quiz_set_name}</h2>
                    </Col>
                </Row>
                <Container className="mr__bottom__1">
                    <Row className="mr__bottom__1">
                        <Col md={{ span: 6, offset: 3 }}>
                            <h4 className="align-text">{`Question ${current} of ${total}`}</h4>
                        </Col>
                    </Row>
                    <Col md={{span:10, offset:1}}>
                        <ProgressBar variant="success" animated  now={currentPercent}/>
                    </Col>
                </Container>

                <Col md={{span:10, offset:1}} className="quiz__container">
                    <TestQuizHeader quiz={currentQuiz}/>

                    <Container>
                    {currentQuiz.quiz_type ==="MULTI" ? 
                        (
                            JSON.parse(atob(currentQuiz.quiz_content)).choices.map((c)=>
                            <TestQuizChoice key={`${current}_${c.index}`} choice={c} onClick={onClick}/>)
                        ) :
                        (
                            <TestQuizAnswer key={current} setTempAnswer={setTempAnswer} tempAnswer={tempAnswer}/>
                        )
                    }
                    <Button block onClick={()=>{handleNext() }}>Next</Button>
                    </Container>
                </Col>
                <QuizModal show={modalShow} onHide={()=> setModalShow(false)}/>
            </Fragment>
            ):
                (<TestQuizResult total={total} />)
        }
        </Container>
    )

}

export default TestQuiz;