import React, {Fragment} from "react";
import { InputGroup,FormControl, Button } from "react-bootstrap";

const ClassCreateForm = () => {
    return (
        <Fragment>
        <h3>강의 개설</h3>
        <InputGroup>
            <FormControl md={4} placeholder="강의 코드"/>
            <FormControl md={6} placeholder="강의 이름"/>
            <InputGroup.Append>
            <Button variant="primary">Create</Button>
          </InputGroup.Append>
        </InputGroup>
        </Fragment>
    );
};

export default ClassCreateForm;
