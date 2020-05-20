import React from "react";

const QuizSetItem = ({id, title}) => {
    return (
    <div>
        <h2>{id}</h2>
        <p>{title}</p>
    </div>
    )
}

export default QuizSetItem;