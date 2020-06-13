import React from 'react';
import styled from 'styled-components';

const HomeHeadline = styled.div`
    font-family: 'Helvetica' !important;
    font-weight: 600;
    color: #fff !important;
    background-color: #007bff !important;
    display: inline-flex !important;
    font-size: 5rem;
    padding-right: 40px;
    padding-left: 10px;
`;



const Home = () =>{
    return (
        <>
        <img src="logoEmoji.png" className="home__emoji"/>
        <div className="mr__top home__container">
        <HomeHeadline className="mr__mi">DQuiz
        </HomeHeadline>
        <br/>
        <HomeHeadline className="mr__mi2">2020-OSSP-OSI</HomeHeadline>
        </div>
        <div className="img__container">
            <img src="rightpanel.png" className="home__img"/>
        </div>
        </>
    )
}

export default Home;