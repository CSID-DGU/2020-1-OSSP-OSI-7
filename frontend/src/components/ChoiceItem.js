import React from 'react';
import {Form, Col} from 'react-bootstrap';

const ChoicesItem = (props) =>{
    const {choice} = props;
    return (
        <Form.Group as={Col} md={2}>
        <Form.Control placeholder={choice}>
        </Form.Control>
        </Form.Group>
    );
}

export default ChoicesItem;