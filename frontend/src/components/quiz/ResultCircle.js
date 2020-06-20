import React,{Fragment} from 'react';
import CheckCircle from './CheckCircle';



const ResultCircle = ({index, result, modalOn, handleShow,handleClose})=>{
    return (
        <Fragment>
          <CheckCircle index={index} wrong={!result} handleShow={()=>handleShow(index)}/>
        </Fragment>
    )
}

export default ResultCircle;