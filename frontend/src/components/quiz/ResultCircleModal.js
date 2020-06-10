import React,{Fragment} from 'react';
import {Modal, Button} from 'react-bootstrap';
import styled from 'styled-components';

const ResultIndicator = styled.div`
    width: 4rem;
    height: 1.25rem;
    border-radius: 1rem;
    background-color: ${
        props=>props.wrong === true 
        ? "#33AE40" 
        : "#DF3838"
    };
    display: flex;
    margin-left: 1rem;
`;

const ModalHeaderContainer = styled.div`
    display:flex;
    align-items:center;
`;

const ResultCircleModal = ({index, onClick, wrong}) => {

    return (
        <Fragment>
            <Modal.Header closeButton>
            <ModalHeaderContainer>
            <Modal.Title>
                문항 {index+1}
            </Modal.Title>
            <ResultIndicator wrong={!wrong}/>
            
            </ModalHeaderContainer>
            </Modal.Header>
            <Modal.Body>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClick}>NEXT</Button>
            </Modal.Footer>

        </Fragment>
        

    )
}

export default ResultCircleModal;