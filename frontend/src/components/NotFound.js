import React, {useState} from 'react';
import {Button, Container,Row} from 'react-bootstrap';
import styled from 'styled-components';
import BigRedBtn from './BigRedBtn';
import { useHistory } from "react-router-dom";



const ChangeBackground = styled.div`
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: red;
    z-index:1;
    opacity: ${props=>(props.btnCount/5)}
`;
const ErrorContainer = styled.div`
    z-index: 2;
    display:flex;
    justify-content: center;
    align-items:center;
`;

const ErrorHeader = styled(ErrorContainer)`
    flex-direction: column;
`;
const ErrorH6 = styled(ErrorContainer)`
    font-size: 6rem;
`;
const ErrorH5 = styled(ErrorContainer)`
    font-size: 5rem;
`;
const ErrorH2 = styled(ErrorContainer)`
    font-size: 2rem;
`;

const NotFound = () =>{
    let history = useHistory();
    const [btnCount, setBtnCount] = useState(0);

    const handleClick = () =>{
        if(btnCount === 4){
            history.push('/');
        }
        setBtnCount(btnCount+1);        
    }

    return (
        <ErrorHeader>
            <ErrorH5>Oops!</ErrorH5>
            <ErrorH6>404</ErrorH6>
            <ErrorH2>page not found</ErrorH2>
            <ErrorH2>press button 5 times</ErrorH2>
            <BigRedBtn onClick={handleClick}/>
            <ChangeBackground btnCount={btnCount} />
        </ErrorHeader>
    )
}

export default NotFound;