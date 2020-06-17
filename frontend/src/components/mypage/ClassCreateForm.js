import React, {Fragment, useState} from "react";
import { InputGroup,FormControl, Button } from "react-bootstrap";
import {createClass} from '../../lib/api/class';
import CenteredModal from '../common/CenteredModal';
import ConfirmClassModal from './ConfirmClassModal';
import {modalShow} from '../atoms';
import {useRecoilState} from 'recoil';


const ClassCreateForm = () => {
    const [class_code, setCode] = useState("");
    const [class_name, setName] = useState("");
    const [modalOn, setModalShow] = useRecoilState(modalShow);

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if(name === "class_code"){
            setCode(value);
        } else if(name === "class_name"){
            setName(value);
        }
    }

    const onSubmit = () => {
        setModalShow(true);
    }
    
    const onClick = async () =>{
        await createClass({class_code, class_name});
        await setModalShow(false);
    }

    return (
        <Fragment>
        <h3>강의 개설</h3>
        <InputGroup>
            <FormControl name="class_code" onChange={(e)=>onChange(e)} md={4} placeholder="강의 코드"/>
            <FormControl name="class_name" onChange={(e)=>onChange(e)} md={6} placeholder="강의 이름"/>
            <InputGroup.Append>
            <Button onClick={()=>onSubmit()} variant="primary" style={{"z-index": "0"}}>개설 하기</Button>
          </InputGroup.Append>
        </InputGroup>
        
        <CenteredModal
            show={modalOn}
            onHide={() => setModalShow(false)}
            body="Awef">
            <ConfirmClassModal onClick={()=>createClass({class_code, class_name})}
                class_code={class_code} 
                class_name={class_name}
                onHide={() => setModalShow(false)}
                />
        </CenteredModal>

        </Fragment>
    );
};

export default ClassCreateForm;
