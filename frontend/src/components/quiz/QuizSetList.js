import React, { Fragment, useState } from "react";
import QuizSetItem from './QuizSetItem';
import {useRecoilValue} from 'recoil';
import {currentUser,userAuth} from '../atoms';

const QuizSetList = ({itemStyle, quizsets, class_code}) =>{
    const user = useRecoilValue(currentUser);
    const auth = useRecoilValue(userAuth);

    console.log(quizsets);
    return (
        <Fragment>
        {
            (quizsets !== null) &&
            
            quizsets.map((quizset,index)=> <QuizSetItem user={user} auth={auth} quizset={quizset} itemStyle={itemStyle} class_code={class_code}/>)}
        
            </Fragment>
    )
}

export default QuizSetList;
