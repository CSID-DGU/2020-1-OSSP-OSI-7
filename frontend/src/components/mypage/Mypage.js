import React from 'react';
import {Container, Col,Row} from 'react-bootstrap';
import {useRecoilValue} from 'recoil';
import {currentUser} from '../atoms';


const Mypage = () =>{
    const user = useRecoilValue(currentUser);
    return (
        <Container className="quiz__container">
            {user}
        </Container>
    )
}

export default Mypage;