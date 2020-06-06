import React, { Fragment } from 'react';
import {Modal, Button} from 'react-bootstrap';
import styled from 'styled-components';
import {FaBook} from 'react-icons/fa';

const ConfirmClass = styled.div`
    font-size: 1.5rem;
    color: var(--blue);
    display:flex;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #6c757d33;
    border-radius: 2rem;
    padding: 0.25rem 1rem;
    width: fit-content;
    svg {
        margin-right: 1rem;
    }
`;



const ConfirmClassModal = ({onHide, onClick, class_code, class_name}) => {
    return (
        <Fragment>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Are you sure this is Right?</h4>
                <ConfirmClass><FaBook/>{class_code}  {class_name}</ConfirmClass>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={onClick}>Open Course</Button>
            </Modal.Footer>
        </Fragment>
    );
}

export default ConfirmClassModal;