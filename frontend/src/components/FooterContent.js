import React from 'react';
import styled from 'styled-components';
import {GoMarkGithub} from 'react-icons/go';

const FooterContainer = styled.div`
    display:flex;
    justify-content:center;
    align-content:center;
    align-items:center;
    padding: 1rem;
    color:#8b8b8b;
    flex-direction: column;
    font-weight: 100;
`;

const IconLink = styled.a`
    text-decoration:none;
    color:#000;
`;


const FooterContent = () =>{
    return (
        <>
        <FooterContainer>
            <h5>2020-OSSP-OSI DQUIZ</h5>
            <IconLink target="_blank" href="https://github.com/CSID-DGU/2020-1-OSSP-OSI-7">
                <GoMarkGithub/>
            </IconLink>
        
        </FooterContainer>
        </>
    );
}

export default FooterContent;