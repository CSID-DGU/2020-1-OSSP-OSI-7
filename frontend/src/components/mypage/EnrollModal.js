import React, {Fragment} from 'react';
import {Modal} from 'react-bootstrap';
import CheckCircle from '../quiz/CheckCircle';


const EnrollModal = ({isSuccess, class_code}) =>{

    return (
        <Fragment>
            <Modal.Header>
                <Modal.Title>
                    <CheckCircle  wrong={!isSuccess} className="modal__circle"/>
                    {
                        isSuccess ? "Success!" : "Error"
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    isSuccess 
                    ? `Enrolled Successfully at ${class_code}`
                    : "Class Doesn't Exist or Already Enrolled"
                }
            </Modal.Body>
        </Fragment>
    )

}

export default EnrollModal;