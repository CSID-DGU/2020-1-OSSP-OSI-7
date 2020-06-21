import React, {Fragment} from 'react';
import {Modal, Button} from 'react-bootstrap';

const CenteredModal = (props)=> {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
      {
        props.children ? (props.children):
        (
          <Fragment>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Modal heading
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Centered Modal</h4>
              <p>
                {props.body}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
            </Fragment>
          )
        }
      </Modal>
    );
  }

  export default CenteredModal;