import React, { Fragment } from "react";
import EnrollForm from "./EnrollForm";
import SolvedQuizList from "./SolvedQuizList";
import ClassCreateForm from "./ClassCreateForm";

const MypageRight = ({ auth }) => {
    return (
        <Fragment>
            {auth? 
                <ClassCreateForm />:
                <EnrollForm />} 
            <hr />
            <SolvedQuizList />
        </Fragment>
    );
};

export default MypageRight;
