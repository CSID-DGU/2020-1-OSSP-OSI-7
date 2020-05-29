import React,{Fragment} from 'react';
import EnrollForm from './EnrollForm';
import SolvedQuizList from './SolvedQuizList';

const MypageRight = (props)=>{
    return (
        <Fragment>
            <EnrollForm/>
            <hr/>
            <SolvedQuizList/>
        </Fragment>
    );
}

export default MypageRight;