import React, {Fragment} from 'react';
import {Modal} from 'react-bootstrap';
import CheckCircle from '../quiz/CheckCircle';


const EnrollModal = ({isSuccess, class_code}) =>{

    return (
        <Fragment>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <CheckCircle  wrong={!isSuccess} className="modal__circle"/>
                    {
                        isSuccess ? "수강신청 성공!" : "문제가 있어요!"
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    isSuccess 
                    ? `${class_code} 강의가 성공적으로 신청되었습니다! 😆`
                    : "존재하지 않는 강의이거나, 이미 신청한 강의입니다! 😢"
                }
            </Modal.Body>
        </Fragment>
    )

}

export default EnrollModal;