import React,{Fragment, useState} from 'react';
import ResultCircle from './ResultCircle';
import {useRecoilState} from 'recoil';
import {modalShow} from '../atoms';
import CenteredModal from '../common/CenteredModal';
import ResultCircleModal from './ResultCircleModal';

const ResultCirclesContainer = ({results}) =>{
  const [modalOn, setModalOn] = useRecoilState(modalShow);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClose = () => {
    setModalOn(false);
  };
  const handleShow = (key) => {
    setCurrentIndex(key);
    setModalOn(true);
  };

  const handleClick = () =>{
    setCurrentIndex((currentIndex + 1) % results.length);
  }
    return (
        <Fragment>
        <div className="circle__container">
        {
            results.map((r,index)=>
            <ResultCircle index={index} key={index}  result={r} modalOn={modalOn} handleShow={handleShow} handleClose={handleClose}/>
            )
        }
        
        </div>
        <CenteredModal
        show={modalOn}
        onHide={handleClose}
        >
        <ResultCircleModal index={currentIndex} wrong={results[currentIndex]} onClick={handleClick}/>
        </CenteredModal>
        </Fragment>
    );
}


export default ResultCirclesContainer;