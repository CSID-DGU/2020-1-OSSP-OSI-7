import React, {useState, useEffect} from 'react';
import {Container, Row,Col } from 'react-bootstrap';
import 'react-circular-progressbar/dist/styles.css';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';


const TestQuizResult = ({total}) =>{
    const [value,setValue] = useState(0);

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
        <Container>
        <Row>
            <Col md={{span: 6, offset:3}}> 
                <h2 className="align-text">Test Result</h2>
            </Col>
        </Row>
        <Row>
        <Col xs={{span: 8, offset: 2}} md={{span:4,offset:4}}>
        <CircularProgressbar height="100px" value={value} text={`${value}/${total}`} maxValue={total} styles={buildStyles({
            pathColor: pathColor,
            trailColor: "#edf2f9",
            textColor: "black",
        })} />
        
        </Col>
        </Row>

        </Container>
    );
}

export default TestQuizResult;