import React, {Fragment, useState} from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import {enrollClass} from '../../lib/api/class';
import CenteredModal from '../common/CenteredModal';
import {modalShow} from '../atoms';
import {useRecoilState} from 'recoil';
import EnrollModal from './EnrollModal';

const EnrollForm = () =>{
  const [class_code, setCode] = useState("");
  const [modalOn, setModalShow] = useRecoilState(modalShow);
  const [isSuccess, setIsSuccess] = useState(false);


  const onChange = (e) =>{
    setCode(e.target.value);
  }

  const onSubmit=async ()=>{
    await enrollClass(class_code).then((res)=>{
      setIsSuccess(true);
    }).catch((e)=>{console.log(e); setIsSuccess(false)});
    await setModalShow(true);
  }


    return (
        <Fragment>
        <h3>수강 신청</h3>
        <InputGroup className="mb-3">
            <FormControl
              placeholder="Class name"
              aria-describedby="basic-addon2"
              onChange={(e)=>onChange(e)}
            />
            <InputGroup.Append>
              <Button variant="primary" onClick={()=>onSubmit()}>Enroll</Button>
            </InputGroup.Append>
        </InputGroup>
        <CenteredModal
        show={modalOn}
        onHide={() => setModalShow(false)}
        >
          <EnrollModal isSuccess={isSuccess} class_code={class_code}/>
        </CenteredModal>
        </Fragment>

    );
}

export default EnrollForm;