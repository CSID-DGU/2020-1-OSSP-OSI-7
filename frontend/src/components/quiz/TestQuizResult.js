import React, {useState, useEffect} from 'react';
import {Row,Col } from 'react-bootstrap';
import SquareContainer from '../SquareContainer';
import 'react-circular-progressbar/dist/styles.css';
import ResultCirclesContainer from './ResultCirclesContainer';
import {quizsetdata} from './quizsetdata';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';



const TestQuizResult = () =>{
    const total = 10;
    const [value,setValue] = useState(0);
    const [quizData, setQuizData] = useState(quizsetdata.quizzes);
    const results = [true, false, true,false];



    const colorGradiant = (percent) => {
        if(percent <= 30){
            return "red";
        } else if(percent <= 60) {
            return "orange";
        } else {
            return "green"
        }
    }

    const pathColor = colorGradiant(value/total * 100);

    useEffect(()=>{
        // 결과 값으로 대체
        setValue(4);
    }, [])

    return (
        <SquareContainer>
            <h3>
                퀴즈 이름
            </h3>
            <h5>
                강의 이름
            </h5>
            <hr className="profile__class__hr"/>
            <Row>
                <Col md={{span: 4, offset:4}}> 
                    <h2 className="align-text">Test Result</h2>
                </Col>
            </Row>
            <Row>
            <Col xs={{span: 6, offset: 3}} md={{span:2,offset:5}}>
            <CircularProgressbar height="100px" value={value} text={`${value}/${total}`} maxValue={total} styles={buildStyles({
                pathColor: pathColor,
                trailColor: "#edf2f9",
                textColor: "black",
            })} />
            </Col>
            </Row>
            <Row>
                <Col xs={12} md={{span:4,offset:4}} className="resultCircle__container">
                    <ResultCirclesContainer results={results} quizData={quizData} />            
                </Col>
            </Row>
        </SquareContainer>
    );
}

export default TestQuizResult;