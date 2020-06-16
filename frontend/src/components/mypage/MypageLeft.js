import React, {Fragment, useEffect} from 'react';
import {Image, Row, Col, Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import UserClassList from './UserClassList';
import {useRecoilState} from 'recoil';
import ToggleSwitch from './ToggleSwitch';
import ReactTextTransition from 'react-text-transition';
import {getManagingClass, getEnrolledClass} from '../../lib/api/class';
import {userAuth, managingClasses} from '../atoms';


const MypageLeft = (props)=>{
    const history= useHistory();
    const {avatar, user} = props;
    const [classes, setClasses] = useRecoilState(managingClasses);
    const [auth,setAuth] = useRecoilState(userAuth);

    useEffect(()=>{
        if(auth){
            getManagingClass(user).then((res)=>{setClasses(res.data)});
        }else {
            getEnrolledClass(user).then((res)=>{setClasses(res.data)});
        }
    }, [auth]);

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
        {
            auth &&
            <Row>
            <Col>
            <Button block variant="outline-primary" onClick={()=>history.push('/create')}>퀴즈 만들기</Button>
            </Col>
            </Row>

        }
        <hr className="profile__class__hr"/>
            <UserClassList classes={classes}/>
        </Fragment>
    );
}

export default MypageLeft;