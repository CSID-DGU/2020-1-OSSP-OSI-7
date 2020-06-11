import React, { Fragment, useState } from "react";
import QuizSetItem from './QuizSetItem';
import {useRecoilValue} from 'recoil';
import {currentUser,userAuth} from '../atoms';

const QuizSetList = ({itemStyle, quizsets}) =>{
    const user = useRecoilValue(currentUser);
    const auth = useRecoilValue(userAuth);
    const [quizsetList, setQuizSetList] = useState(quizsets);

    return (
        <Fragment>
        {quizsetList.quizsetsList.map((quizset,index)=> <QuizSetItem user={user} auth={auth} quizset={quizset} itemStyle={itemStyle} />)}
        </Fragment>
    )
}

export default QuizSetList;
