import React, {Fragment} from "react";
import QuizForm from "./QuizForm";
import AnswerForm from "./AnswerForm";


const QuizList = (props) => {
    const { quizzes, onRemove, onTypeChange, addChoices} = props;

    const QuizLists = quizzes.map((quiz, index) => 
        <QuizForm key={quiz.id} index={quiz.id} type={quiz.type} onRemove={onRemove} onTypeChange={onTypeChange} AnswerForm={<AnswerForm quiz={quiz} addChoices={addChoices}/>} />
        );

    return (
        <Fragment>
            {QuizLists}
        </Fragment>
    );
};

export default QuizList;
