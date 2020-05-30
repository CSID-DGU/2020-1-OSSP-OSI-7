import React, {Fragment, useState} from 'react';
import {Image, Row, Col} from 'react-bootstrap';
import UserClassList from './UserClassList';
import {useRecoilState} from 'recoil';
import ToggleSwitch from './ToggleSwitch';
import ReactTextTransition from 'react-text-transition';
import {userAuth} from '../atoms';

import {classdata} from './classData';

const MypageLeft = (props)=>{
    const {avatar, user} = props;
    const [classes, setClasses] = useState(classdata);
    const [auth,setAuth] = useRecoilState(userAuth);


    return (
        <Fragment>
        <Image src={avatar} fluid className="profile__img"/>
        <Row>
            <Col>
                <h3>2015111888</h3>
                <h5 className="profile__username">{user}</h5>
            </Col>
        </Row>

        <Row>
            <Col xs={6} md={8} xl={6} className="flex__align__center">
                <ReactTextTransition text={auth ? "Professor" : "Student"} className="profile__auth" />
            </Col>
            <Col xs={6} md={4} xl={6} className="toggle__container flex__align__center">
                <ToggleSwitch
                isOn={auth}
                onColor={"#06D6A0"}
                handleToggle={() => setAuth(!auth)}
                />
            </Col>
        </Row>

        <hr className="profile__class__hr"/>
        <UserClassList classes={classes}/>
        </Fragment>
    );
}

export default MypageLeft;