import React,{useState,useEffect} from 'react';
import QuizSetList from '../quiz/QuizSetList';
import {useHistory} from 'react-router-dom';
import {Container,Row,Col, Image, Form,Button} from 'react-bootstrap';
import {userAuth} from '../atoms';
import {useRecoilValue} from 'recoil';
import {getClassQuizSet} from '../../lib/api/class';



const ClassRoom = ({match, location}) =>{
    // api 추가 예정 퀴즈 받아오기
    const [keyword, setKeyword] = useState("");
    const [quizsetList, setQuizSetList] = useState([]);
    const auth = useRecoilValue(userAuth);
    const history = useHistory();
    const {classId} = match.params;
    const {class_code, class_name} = location.state;


    useEffect(()=>{
        getClassQuizSet(class_code).then(
            (res)=>setQuizSetList(res.data))
    }, []);


    return(
        <Container className="quiz__container__no_border" as={Col} md={{ span: 8, offset: 2 }}>
        <Row>
            <Col xs={4} md={3} lg={2}>
                <Image src="https://cdn-res.keymedia.com/cms/images/au/130/0314_637232847506093449.jpg" fluid className="profile__img"></Image>
            </Col>

            <Col xs={8} md={9} lg={10}>
                <h3>{class_name}</h3>
                <h4>{class_code}</h4>
                <p></p>
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
        <QuizSetList itemStyle={"profile__quiz__item"} quizsets={quizsetList} class_code={class_code}/>
        </Col>
        </Row>
        </Container>
    )

}

export default ClassRoom;