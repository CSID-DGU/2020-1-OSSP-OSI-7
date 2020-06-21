import React, {useState, useEffect} from 'react';
import {Row,Col } from 'react-bootstrap';
import SquareContainer from '../SquareContainer';
import 'react-circular-progressbar/dist/styles.css';
import ResultCirclesContainer from './ResultCirclesContainer';
import {quizsetdata} from './quizsetdata';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {getQuizResult} from '../../lib/api/quiz';
import {currentUser} from '../atoms';
import {useRecoilValue} from 'recoil';
import {useHistory} from 'react-router-dom';


const TestQuizResult = ({match, location}) =>{
    const [percent, setPercent] = useState(0);
    const [isTrueResult, setTrueResult] = useState([]);
    const [quizData, setQuizData] = useState(quizsetdata.quizzes);
    const results = [true, false, true,false];
    const {quizSetName} = match.params;
    const username = useRecoilValue(currentUser);
    const [quizset, setQuizSet] = useState(location.state.quizset);
    const history = useHistory();
    
    const getBinary = (dec) => {
        return (dec >>> 0).toString(2);
    }
    
    const setQuizTrueFalse = (total, myscore) =>{
        return (getBinary(total) ^ getBinary(myscore)).toString().split("").map((i) =>(i==="0")).reverse();
    }
    
    const makeQuizResult = (quizData) => {
        console.log(quizData);
        setTrueResult(setQuizTrueFalse(quizData.total_score, quizData.my_score));
        setPercent(isTrueResult.filter((c) => c=== true).length/isTrueResult.length * 100);
    }

    useEffect(()=>{
        getQuizResult(username).then(
            (res)=>{
                makeQuizResult(res.data.filter(quiz => quiz.quiz_set_name === quizSetName)[0])
            
            }
        )
    }, []);
    console.log(isTrueResult);
    const colorGradiant = (percent) => {
        if(percent <= 30){
            return "red";
        } else if(percent <= 60) {
            return "orange";
        } else {
            return "green"
        }
    }


    return (
        <SquareContainer>
            <h3>
                퀴즈 : {quizset.quiz_set_name}
            </h3>
            <h5>
                출제자 : {quizset.quiz_set_author_name}
            </h5>
            <hr className="profile__class__hr"/>
            <Row>
                <Col md={{span: 4, offset:4}}> 
                    <h2 className="align-text">퀴즈 결과</h2>
                </Col>
            </Row>
            <Row>
            <Col xs={{span: 6, offset: 3}} md={{span:2,offset:5}}>
            <CircularProgressbar height="100px" value={isTrueResult.filter((c) => c=== true).length} text={`${isTrueResult.filter((c) => c=== true).length}/${isTrueResult.length}`} maxValue={isTrueResult.length} styles={buildStyles({
                pathColor: colorGradiant(percent),
                trailColor: "#edf2f9",
                textColor: "black",
            })} />
            </Col>
            </Row>
            <Row>
                <Col xs={12} md={{span:4,offset:4}} className="resultCircle__container">
                    <ResultCirclesContainer results={isTrueResult} quizData={quizset.quizzes} />            
                </Col>
            </Row>
        </SquareContainer>
    );
}

export default TestQuizResult;