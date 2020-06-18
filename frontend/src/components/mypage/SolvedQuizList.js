import React,{useEffect, useState} from 'react';
import QuizSetList from '../quiz/QuizSetList';
import {userAuth,currentUser} from '../atoms';
import {useRecoilValue} from 'recoil';
import {getQuizSetList} from '../../lib/api/quiz';
import styled from 'styled-components';
import {GrSort} from 'react-icons/gr';
import {Button} from 'react-bootstrap';

const quizsetdata = {quizsetsList:
    [
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 1,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"yongsk0066@dongguk.edu",
            quiz_set_id: 2,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"testuser@dongguk.edu",
            quiz_set_id: 3,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 4,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 5,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 6,
            quiz_set_name: "hello world",
            quizzes:""
        }
    ]
}

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
            setQuizSets(quizsetdata.quizsetsList);
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