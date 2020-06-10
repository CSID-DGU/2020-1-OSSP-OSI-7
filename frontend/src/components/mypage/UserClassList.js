import React, {useState} from 'react';
import {useHistory}from 'react-router-dom';
import UserClassItem from './UserClassItem';

const UserClassList = ({classes}) =>{
    const history = useHistory();

    return (
        <div>
            <h3>강의 목록</h3>
            {classes && classes.map((c)=><UserClassItem key={c.class_name} classInfo={c} onClick={()=>history.push(`/class/${c.class_code}`)}/>)}
        </div>
    )
}

export default UserClassList;