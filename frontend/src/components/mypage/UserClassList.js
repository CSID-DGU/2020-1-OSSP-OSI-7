import React from 'react';
import {useHistory}from 'react-router-dom';
import UserClassItem from './UserClassItem';

const UserClassList = ({classes}) =>{
    const history = useHistory();

    return (
        <div>
            <h3>강의 목록</h3>
            {classes && classes.map((c)=><UserClassItem key={c.class_name} classInfo={c} 
            onClick={()=>history.push({
                pathname:`/class/${c.class_code}`, 
                state:{class_code:c.class_code, class_name:c.class_name}
            })}/>)}
        </div>
    )
}

export default UserClassList;