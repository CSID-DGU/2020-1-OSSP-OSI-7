import React,{useEffect, useState} from 'react';
import QuizSetList from '../quiz/QuizSetList';
import {userAuth,currentUser} from '../atoms';
import {useRecoilValue} from 'recoil';
import {getQuizSetList, getQuizResult} from '../../lib/api/quiz';
import styled from 'styled-components';
import {GrSort} from 'react-icons/gr';
import {Button} from 'react-bootstrap';


const QuizListHeader = styled.div`
    display:flex;
    justify-content: space-between;
`;

const SolvedQuizList = () =>{
    const [quizsets, setQuizSets] = useState([]);
    const auth = useRecoilValue(userAuth);
    const username = useRecoilValue(currentUser);

    useEffect(()=>{
        if(auth){
            getQuizSetList(username).then(
                (res)=>setQuizSets(res.data));
        } else {
            getQuizResult(username).then(
                (res)=>setQuizSets(res.data)
            );
        }
    }, [auth]);
    // api 추가 예정 퀴즈 받아오기
    return (
        <div>
        <QuizListHeader>
        <h3  >
        {
            auth ? "만든 퀴즈 목록" : "푼 퀴즈 목록"
        }
        </h3>
        <GrSort className="sort__icon" onClick={()=>setQuizSets([...quizsets].reverse())}/>
        </QuizListHeader>
            <QuizSetList itemStyle={"profile__quiz__item"} quizsets={quizsets}/>
        </div>
    );
}


export default SolvedQuizList;