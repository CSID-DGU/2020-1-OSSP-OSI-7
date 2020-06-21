import React, { Fragment,useState } from 'react';
import {Modal, Button} from 'react-bootstrap';
import styled from 'styled-components';
import {FaBook} from 'react-icons/fa';
import ReactTextTransition from 'react-text-transition';
import CheckCircle from '../quiz/CheckCircle';
import {managingClasses} from '../atoms';
import {useRecoilState} from 'recoil';



const ConfirmClass = styled.div`
    font-size: 1.5rem;
    color: var(--blue);
    display:flex;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #6c757d33;
    border-radius: 2rem;
    padding: 0.25rem 1rem;
    width: fit-content;
    svg {
        margin-right: 1rem;
    }
`;



const ConfirmClassModal = ({onHide, onClick, class_code, class_name}) => {
    const [isOpened, setIsOpened] = useState(false);
    const [isError, setIsError] = useState(false);
    const [classes, setClasses] = useRecoilState(managingClasses);

    
    const textChange = (type) =>{
        const textArray = [
            ["강의 개설 성공!", "문제가 있네요!", "입력 확인"],["성공적으로 강의가 개설되었습니다! 😄", "동일한 강의가 이미 존재합니다. 😢", "강의 코드와 이름을 확인 해주세요! ☝️"]
        ];
        let selectArray = textArray[1];
        if(type === "title"){
            selectArray = textArray[0];
        }
    
        if(isOpened) {
            return selectArray[0];
        } else if (isError) {
            return selectArray[1];
        } else {
            return selectArray[2];
        }
    }
    return (
        <Fragment>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {isError && (<CheckCircle wrong className="modal__circle"/>)}    
                    {isOpened && (<CheckCircle className="modal__circle"/>)}    
                <ReactTextTransition text={textChange("title")} inline className="confirm__modal__title" />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReactTextTransition inline text={textChange("content")} className="confirm__modal" />
                {
                    (!isOpened && !isError) && 
                    (<ConfirmClass><FaBook/>{class_code}  {class_name}</ConfirmClass>)
                }
            </Modal.Body>
            {
                (!isOpened && !isError) && (
                    <Modal.Footer>
                        <Button variant="outline-primary" onClick={onHide}>취소 하기</Button>
                        <Button variant="primary" onClick={async ()=>onClick().then((res)=>{setIsOpened(true); setIsError(false); setClasses(classes.concat([{"class_name":class_name,"class_code":class_code}]))})
                        .catch((e)=>setIsError(true))}>강의 개설</Button>
                    </Modal.Footer>
                        ) 
            }
        </Fragment>
    );
}

export default ConfirmClassModal;