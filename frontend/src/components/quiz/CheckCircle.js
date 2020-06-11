import React, {Fragment} from 'react';
import styled from 'styled-components';
import {FaCheck,FaTimes} from 'react-icons/fa'


const Circle = styled.div`
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
    display:flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.25rem 0.5rem 0.25rem ;
    cursor:pointer;
    background-color: ${props=>props.wrong === true? "#DF3838" : "#33AE40"};
    &:hover {
        box-shadow: 2px 2px 4px #000000a1;
    }
`;


const CheckCircle = (props)=>{
    return (
        <Fragment>
            <Circle wrong = {props.wrong} onClick={()=>props.handleShow()} className={props.className}>
            {props.wrong ?
                <FaTimes className="checkcircle__inner"/>:
                <FaCheck className="checkcircle__inner"/>
            }
            </Circle>
        </Fragment>
    )
}


export default CheckCircle;