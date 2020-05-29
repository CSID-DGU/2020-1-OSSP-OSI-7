import React,{useState, useEffect, Fragment} from 'react';
import {Col, Row} from 'react-bootstrap';
import {IoIosSchool} from 'react-icons/io';

const UserClassItem = (props) =>{
    const {classInfo} = props;
    const [className, setClassName] = useState(classInfo.class_code);
    const [classCode, setClassCode] = useState(classInfo.class_name);

    useEffect (()=>{
        if(className.length > 6){
            setClassName(className.slice(0,6) + "...");
        }
    }, [className]);


    return (
        <Fragment>
        <Row>
            <Col xs={6}>
            {className}
            </Col>
            <Col xs={4}>
            {classCode}
            </Col>
            <Col xs={2}>
            🏫
            </Col>
        </Row>
        <hr className="profile__class__hr"/>
        </Fragment>
    );
}

export default UserClassItem;