import React, {Fragment, useState} from 'react';
import {Image,Container, Row} from 'react-bootstrap';
import UserClassList from './UserClassList';

import {classdata} from './classData';

const MypageLeft = (props)=>{
    const {avatar, user} = props;
    const [classes, setClasses] = useState(classdata);


    return (
        <Fragment>
        <Image src={avatar} fluid className="profile__img"/>
        <h3>2015111888</h3>
        <h5 className="profile__username">{user}</h5>
        <hr/>
        <UserClassList classes={classes}/>
        </Fragment>
    );
}

export default MypageLeft;