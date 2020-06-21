import React, { Fragment } from 'react';
import {Modal, Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import CheckCircle from '../quiz/CheckCircle';
import {currentUser, modalShow} from '../atoms';

import {useRecoilValue, useRecoilState} from 'recoil';


const QuizCreateModal = () => {
    const [modalOn, setModalShow] = useRecoilState(modalShow);
    let history = useHistory();
    return (
        <Fragment>
            <Modal.Header closeButton>
                <Modal.Title>
                <CheckCircle className="modal__circle"/>
                <div>
                퀴즈 만들기 성공!
                </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            성공적으로 퀴즈가 만들어졌습니다! 😆
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={()=>{setModalShow(false); history.push('/mypage');}}>
                Mypage로 돌아가기
                </Button>
            </Modal.Footer>
        </Fragment>
    )
}

export default QuizCreateModal