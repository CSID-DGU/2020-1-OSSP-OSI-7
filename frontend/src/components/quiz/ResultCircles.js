import React,{Fragment, useState} from 'react';
import {Container,Col,Row,Modal, Button} from 'react-bootstrap';
import CheckCircle from './CheckCircle';

const ResultCircle = ({results}) =>{
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Fragment>
        <div className="circle__container">
        {
            results.map((r)=>
            <CheckCircle  wrong={r} handleShow={handleShow}/>
            )
        }
        
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        </Fragment>
    );
}


export default ResultCircle;