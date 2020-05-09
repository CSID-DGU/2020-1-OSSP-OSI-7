import React, {useState} from 'react';
import {Button, Form, Dropdown, Container, Row, Col, Badge} from 'react-bootstrap';




const QuizForm = (props)=>{
    const [id, setId] = useState(props.index);
    const [type, setType] = useState(props.type);
    const [question, setQuestion] = useState("");
    const koreanDict = {"mul_choices":"객관식", "essay":"주관식", "short_answer":"단답형","binary":"OX형"};
    const removeQuiz = props.removeQuiz;
    // const convert2Korean = (quizType)=>{

    // }
    return(
        <Container>
        <Row>
            <Col md={"auto"} className="mr-auto">
            <Button variant="secondary">문항 {id}</Button>
            </Col>

            <Col md={"auto"}>
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {koreanDict[type]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>{setType("mul_choices")}}>객관식</Dropdown.Item>
                <Dropdown.Item onClick={()=>{setType("essay")}}>주관식</Dropdown.Item>
                <Dropdown.Item onClick={()=>{setType("short_answer")}}>단답형</Dropdown.Item>
                <Dropdown.Item onClick={()=>{setType("binary")}}>OX형</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </Col>
            <Col md={"auto"}>
                <Button variant="danger" onClick={()=>removeQuiz(id-1)}>X</Button>
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
        </Form>

        </Container>
        );
}


export default QuizForm;
