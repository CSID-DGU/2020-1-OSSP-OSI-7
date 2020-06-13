import React,{Fragment} from 'react';
import {Modal, Button,Col} from 'react-bootstrap';
import styled from 'styled-components';

const ChoiceBlock = styled.div`
    color: #707070;
    margin-bottom: 0.5rem;
    border-color:#E2E2E2;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    background-color: transparent;
    border: 1px solid #E2E2E2;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    background-color: ${props=>props.isAnswer !== -1 && "#3caf57"};
    color: ${props=>props.isAnswer !== -1 && "#fff"};
`;

const AnswerBlock = styled.div`
    text-decoration: underline solid #3caf57;
    text-decoration-skip-ink: auto;
`;


const ResultIndicator = styled.div`
    width: 4rem;
    height: 1.25rem;
    border-radius: 1rem;
    background-color: ${
        props=>props.wrong === true 
        ? "#33AE40" 
        : "#DF3838"
    };
    display: flex;
    margin-left: 1rem;
`;

const ModalHeaderContainer = styled.div`
    display:flex;
    align-items:center;
`;

const ResultCircleModal = ({index, onClick, wrong, quizInfo}) => {
    // const [choices, setChoices] = useState([]);
    // useEffect(()=>{
    //     if(quizInfo.quiz_type === "MULTI") {
    //         setChoices(quizInfo.quiz_answer.split(","));
    //         console.log(choices);
    //     }
    // },[]);

    
    return (
        <Fragment>
            <Modal.Header closeButton>
            <ModalHeaderContainer>
            <Modal.Title>
                문항 {index+1}
            </Modal.Title>
            <ResultIndicator wrong={!wrong}/>
            
            </ModalHeaderContainer>
            </Modal.Header>
            <Modal.Body>
            <h4>{quizInfo.quiz_title}</h4>
            <p>{quizInfo.quiz_type}</p>
            {
                (quizInfo.quiz_type === "MULTI") && 
                quizInfo.quiz_content.choices.map(
                    (c)=><ChoiceBlock isAnswer={quizInfo.quiz_answer.split(",").indexOf((c.id).toString())} as={Col} fluid>{c.choice}</ChoiceBlock>
                )
            }
            {
                (quizInfo.quiz_type === "SHORT") && 
                <AnswerBlock>{quizInfo.quiz_answer}</AnswerBlock>
            }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClick}>NEXT</Button>
            </Modal.Footer>

        </Fragment>
        

    )
}

export default ResultCircleModal;