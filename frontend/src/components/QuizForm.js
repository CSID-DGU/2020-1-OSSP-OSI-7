import React from 'react';
import {Button, Form, Dropdown, Container, Row, Col} from 'react-bootstrap';




const QuizForm = (props)=>{
    const koreanDict = {"mul_choices":"객관식", "essay":"주관식", "short_answer":"단답형","binary":"OX형"};
    const {onRemove, onTypeChange, AnswerForm, onChange, quiz, addChoices, onRemoveChoice, selectAnswerChoice} = props;
    const {id, type} = quiz;



    return(
        <Container className="quiz_container">
        <Row className="row_margin">
            <Col xs={"auto"} className="mr-auto">
            <Button variant="secondary">문항 {id+1}</Button>
            </Col>

            <Col xs={"auto"}>
            <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
                {koreanDict[type]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>{onTypeChange(id,"mul_choices")}}>객관식</Dropdown.Item>
                <Dropdown.Item onClick={()=>{onTypeChange(id,"essay")}}>주관식</Dropdown.Item>
                <Dropdown.Item onClick={()=>{onTypeChange(id,"short_answer")}}>단답형</Dropdown.Item>
                <Dropdown.Item onClick={()=>{onTypeChange(id,"binary")}}>OX형</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </Col>
            <Col xs={"auto"}>
                <Button variant="danger" onClick={()=>onRemove(id)}>X</Button>
            </Col>
        </Row>

            
        <Form>
        <Form.Group as={Row}>
            <Form.Label  column sm="2">QUESTION</Form.Label>
            <Col sm="10">
            <Form.Control  as="textarea" name="question" quizId={id} value={quiz.question} onChange={(e)=>{onChange(e)}}></Form.Control>
            </Col>
        </Form.Group>
        <Form.Group as={Row}>
            <Form.Label  column sm="2">DESCRIPTION</Form.Label>
            <Col sm="10">
                <Form.Control as="textarea" name="description" quizId={id} value={quiz.content.description} onChange={(e)=>{onChange(e)}}></Form.Control>
            </Col>
        </Form.Group>
        <Form.Group as={Row}>
        <AnswerForm  addChoices={addChoices} onChange={onChange}
        quiz={quiz} onRemoveChoice={onRemoveChoice}
        selectAnswerChoice={selectAnswerChoice}
        />
        </Form.Group>
        </Form>
        </Container>
        );
}


export default QuizForm;
