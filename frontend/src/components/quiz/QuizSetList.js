import React, { Fragment, useState } from "react";
import QuizSetItem from './QuizSetItem';
import {useRecoilValue} from 'recoil';
import {currentUser,userAuth} from '../atoms';
import {useLocation} from 'react-router-dom';


const QuizSetList = ({itemStyle, quizsets, class_code}) =>{
    const user = useRecoilValue(currentUser);
    const auth = useRecoilValue(userAuth);
    let location = useLocation();


    return (
        <Fragment>
        {
            (quizsets !== null) &&
            
            quizsets.map((quizset,index)=> <QuizSetItem user={user} location={location.pathname} auth={auth} quizset={quizset} itemStyle={itemStyle} class_code={class_code}/>)}
        
            </Fragment>
    )
}

export default QuizSetList;
