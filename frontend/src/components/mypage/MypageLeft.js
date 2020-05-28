import React, {Fragment} from 'react';
import {Image,Container} from 'react-bootstrap';
import UserClassList from './UserClassList';

const MypageLeft = (props)=>{
    const {avatar} = props;
    return (
        <Fragment>
        <Image src={avatar} rounded fluid/>
        <h3>2015111888</h3>
        <h5>USERNAME</h5>
        <UserClassList/>
        </Fragment>
    );
}

export default MypageLeft;