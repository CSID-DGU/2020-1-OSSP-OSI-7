import React,{useState,useEffect} from 'react';
import QuizSetList from '../quiz/QuizSetList';
import {useHistory} from 'react-router-dom';
import {Container,Row,Col, Image, Form,Button} from 'react-bootstrap';
import {userAuth} from '../atoms';
import {useRecoilValue} from 'recoil';

const quizsetdata = {quizsetsList:
    [
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 1,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"yongsk0066@dongguk.edu",
            quiz_set_id: 2,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"testuser@dongguk.edu",
            quiz_set_id: 3,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 4,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 5,
            quiz_set_name: "hello world",
            quizzes:""
        },
        {
            quiz_set_author_name:"pop@dongguk.edu",
            quiz_set_id: 6,
            quiz_set_name: "hello world",
            quizzes:""
        }
    ]
}

const ClassRoom = ({match, location}) =>{
    // api 추가 예정 퀴즈 받아오기
    const [keyword, setKeyword] = useState("");
    const [quizsetList, setQuizSetList] = useState(quizsetdata);
    const auth = useRecoilValue(userAuth);
    const history = useHistory();
    const {classId} = match.params;
    const {class_code, class_name} = location.state;

    useEffect(()=>{
        setQuizSetList(quizsetdata);
    }, []);


    return(
        <Container className="quiz__container__no_border">
        <Row>
            <Col xs={4} md={3} lg={2}>
                <Image src="https://placekitten.com/300/300" fluid className="profile__img"></Image>
            </Col>

            <Col xs={8} md={9} lg={10}>
                <h3>{class_name}</h3>
                <h4>{class_code}</h4>
                <p>eoifjaiowejfiojeoifajweiofawi</p>
                </Col>
                </Row>
                <hr className="profile__class__hr"/>
                {auth && <Button variant="outline-primary" block onClick={()=>history.push(`/create/${classId}`)}>퀴즈 만들기</Button>}
            <Form>
            <Form.Group>
                <Form.Control placeholder="search quiz"></Form.Control>
            </Form.Group>
        </Form>
        <Row>
        <Col>
        <h3>퀴즈 목록</h3>
        <QuizSetList itemStyle={"profile__quiz__item"} quizsets={quizsetList}/>
        </Col>
        </Row>
        </Container>
    )

}

export default ClassRoom;