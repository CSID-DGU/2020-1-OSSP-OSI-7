import React from 'react';
import {Button, Form, Dropdown, Container, Row, Col} from 'react-bootstrap';


// <Form.Group as={Row}>
//     <Form.Label  column sm="2">DESCRIPTION</Form.Label>
//     <Col sm="10">
//         <Form.Control as="textarea" name="description" quizId={id} value={quiz.content.description} onChange={(e)=>{onChange(e)}}></Form.Control>
//     </Col>
// </Form.Group>


const QuizForm = (props)=>{
    const koreanDict = {"MULTI":"객관식", "SHORT":"주관식", "short_answer":"단답형","binary":"OX형"};
    const {onRemove, handleBlur, onTypeChange, AnswerForm, onChange, quiz, addChoices, onRemoveChoice, selectAnswerChoice} = props;
    const {id, quiz_type} = quiz;



    return(
        <Container className="quiz__container">
        <Container>
        <Row className="row__mr__bottom">
            <Col xs={"auto"} className="mr-auto">
            <Button variant="secondary">문항 {id+1}</Button>
            </Col>

            <Col xs={"auto"}>
            <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
                {koreanDict[quiz_type]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>{onTypeChange(id,"MULTI")}}>객관식</Dropdown.Item>
                <Dropdown.Item onClick={()=>{onTypeChange(id,"SHORT")}}>주관식</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </Col>
            <Col xs={"auto"}>
                <Button variant="danger" onClick={()=>onRemove(id)}>X</Button>
            </Col>
        </Row>
        </Container>

            
        <Container>
        <Form.Group as={Row}>
            <Form.Label  column sm="2">QUESTION</Form.Label>
            <Col sm="10">
            <Form.Control required as="textarea" name="quiz_title" quizId={id} value={quiz.quiz_title} onChange={(e)=>{onChange(e)}}></Form.Control>
            <Form.Control.Feedback type="invalid">Please type a question</Form.Control.Feedback>
            </Col>
        </Form.Group>
        <Form.Group as={Row}>
        <AnswerForm  addChoices={addChoices} onChange={onChange}
        quiz={quiz} onRemoveChoice={onRemoveChoice}
        selectAnswerChoice={selectAnswerChoice} handleBlur={handleBlur}
        />
        </Form.Group>
        </Container>
        </Container>
        );
}


export default QuizForm;
