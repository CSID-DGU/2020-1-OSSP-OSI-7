import React,{Fragment, useState} from 'react';
import {Container,Col,Row,Modal, Button} from 'react-bootstrap';
import CheckCircle from './CheckCircle';

const ResultCircle = ({results}) =>{
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        document.getElementsByClassName('quiz__container__no_border')[0].classList.remove("modal_blur");
    };
    const handleShow = () => {
        setShow(true);
        document.getElementsByClassName('quiz__container__no_border')[0].classList.add("modal_blur");
    };

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