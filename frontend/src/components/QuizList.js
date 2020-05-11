import React, {Fragment} from "react";
import QuizForm from "./QuizForm";

const QuizList = (props) => {
    const { quizzes, onRemove, onTypeChange, AnswerForm } = props;

    const QuizLists = quizzes.map((quiz, index) => 
        <QuizForm key={quiz.id} index={quiz.id} type={quiz.type} onRemove={onRemove} onTypeChange={onTypeChange} AnswerForm={AnswerForm} />
        );

    return (
        <Fragment>
            {QuizLists}
        </Fragment>
    );
};

export default QuizList;
