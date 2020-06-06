import React from 'react';
import {Container} from 'react-bootstrap';

const SquareContainer = (props) => {
    return (
    <Container className="quiz__container__no_border">
    {props.children}
    </Container>
    )
};

export default SquareContainer;