import React, {Fragment, useState} from 'react';
import {Image, Row, Col} from 'react-bootstrap';
import UserClassList from './UserClassList';
import ToggleSwitch from './ToggleSwitch';
import ReactTextTransition from 'react-text-transition';

import {classdata} from './classData';

const MypageLeft = (props)=>{
    const {avatar, user} = props;
    const [classes, setClasses] = useState(classdata);
    const [auth,setAuth] = useState(false);


    return (
        <Fragment>
        <Image src={avatar} fluid className="profile__img"/>
        <Row>
            <Col xs={7}>
            <h3>2015111888</h3>
            </Col>
            <Col xs={5} className="toggle__container">
            <ToggleSwitch
            isOn={auth}
            onColor={"#06D6A0"}
            handleToggle={() => setAuth(!auth)}
            />
            </Col>
        </Row>

        <Row>
        <Col xs={6}>
            <h5 className="profile__username">{user}</h5>
        </Col>
        <Col xs={6}>
            <ReactTextTransition text={auth ? "Professor" : "Student"} className="profile__auth" />
        </Col>
        </Row>
        <hr/>
        <UserClassList classes={classes}/>
        </Fragment>
    );
}

export default MypageLeft;