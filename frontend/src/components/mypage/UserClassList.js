import React from 'react';
import UserClassItem from './UserClassItem';

const UserClassList = ({classes}) =>{
    return (
        <div>
            <h3>강의 목록</h3>
            {classes.map((c)=><UserClassItem classInfo={c} />)}
        </div>
    )
}

export default UserClassList;