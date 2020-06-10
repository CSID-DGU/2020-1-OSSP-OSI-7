import React from 'react';
import {Container} from 'react-bootstrap';
import {useRecoilValue} from 'recoil';
import {modalShow} from './atoms';


const SquareContainer = (props) => {
    const isModal = useRecoilValue(modalShow);

    return (
    <Container className={`quiz__container__no_border ${isModal&& " modal_blur"}`}>
    {props.children}
    </Container>
    )
};

export default SquareContainer;