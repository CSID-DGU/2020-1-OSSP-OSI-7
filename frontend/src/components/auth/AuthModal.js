import React,{Fragment} from 'react';
import {Modal,Button} from 'react-bootstrap';

const AuthModal = ({onClick, username}) =>{
    return (
        <Fragment>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Success!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>
                    Thank you <b className="username">{username}</b> ! 
                </h5>
                <p>
                Now You are successfully registered!
                Click the button and Redirect to Login
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-success" block onClick={onClick}>Login</Button>
            </Modal.Footer>

        </Fragment>
    );
}


export default AuthModal;