import React from 'react';
import {Button, Form, Dropdown, Container, Row, Col} from 'react-bootstrap';




const QuizForm = (props)=>{
    const koreanDict = {"mul_choices":"객관식", "essay":"주관식", "short_answer":"단답형","binary":"OX형"};
    const {onRemove, onTypeChange, index, AnswerForm} = props;

    return(
        <Container>
        <Row>
            <Col md={"auto"} className="mr-auto">
            <Button variant="secondary">문항 {index+1}</Button>
            </Col>

            <Col md={"auto"}>
            <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
                {koreanDict[props.type]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>{onTypeChange(index,"mul_choices")}}>객관식</Dropdown.Item>
                <Dropdown.Item onClick={()=>{onTypeChange(index,"essay")}}>주관식</Dropdown.Item>
                <Dropdown.Item onClick={()=>{onTypeChange(index,"short_answer")}}>단답형</Dropdown.Item>
                <Dropdown.Item onClick={()=>{onTypeChange(index,"binary")}}>OX형</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </Col>
            <Col md={"auto"}>
                <Button variant="danger" onClick={()=>onRemove(index)}>X</Button>
            </Col>
        </Row>


        <Form>
        <Form.Group>
            <Form.Label>Question</Form.Label>
            <Form.Control></Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control></Form.Control>
        </Form.Group>
        {AnswerForm}
        </Form>
        </Container>
        );
}


export default QuizForm;
