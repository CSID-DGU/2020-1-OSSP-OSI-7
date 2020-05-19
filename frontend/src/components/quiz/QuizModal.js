import React from 'react';
import {Modal, Button} from 'react-bootstrap';

const QuizModal = (props)=>{
    return (
        <Modal
          {...props}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Test Answer Error
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Empty Answer</h4>
            <p>
              Check At Least One Answer
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide} variant="danger" block>Close</Button>
          </Modal.Footer>
        </Modal>
      );

}

export default QuizModal;