import React, {useState} from 'react';
import UserClassItem from './UserClassItem';

const UserClassList = ({classes}) =>{
    return (
        <div>
            <h3>강의 목록</h3>
            {classes && classes.map((c)=><UserClassItem key={c.class_name} classInfo={c} />)}
        </div>
    )
}

export default UserClassList;