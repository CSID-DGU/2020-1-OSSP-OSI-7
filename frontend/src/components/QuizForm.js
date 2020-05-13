import React from 'react';
import {Button, Form, Dropdown, Container, Row, Col} from 'react-bootstrap';




const QuizForm = (props)=>{
    const koreanDict = {"mul_choices":"객관식", "essay":"주관식", "short_answer":"단답형","binary":"OX형"};
    const {onRemove, onTypeChange, AnswerForm, onChange, quiz, addChoices, onRemoveChoice} = props;
    const {id, type} = quiz;



    return(
        <Container>
        <Row>
            <Col xs={"auto"} className="mr-auto">
            <Button draggable='true' variant="secondary">문항 {id+1}</Button>
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
        <Form.Group>
            <Form.Label>Question</Form.Label>
            <Form.Control name="question" index={id} value={quiz.question} onChange={(e)=>{onChange(e)}}></Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control name="description" index={id} value={quiz.description} onChange={(e)=>{onChange(e)}}></Form.Control>
        </Form.Group>
        <AnswerForm  addChoices={addChoices} onChange={onChange} quiz={quiz} onRemoveChoice={onRemoveChoice}/>
        </Form>
        </Container>
        );
}


export default QuizForm;
