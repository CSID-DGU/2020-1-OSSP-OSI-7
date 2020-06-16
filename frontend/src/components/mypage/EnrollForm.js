import React from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';

const EnrollForm = () =>{
    return (
        <div>
        <h3>수강 신청</h3>
        <InputGroup className="mb-3">
            <FormControl
              placeholder="Class name"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button variant="primary">Enroll</Button>
            </InputGroup.Append>
        </InputGroup>
        </div>

    );
}

export default EnrollForm;