import React, { useState, useEffect, Fragment, Component} from "react";
import { Button, Container, ButtonToolbar, ButtonGroup,Form, Row,Col } from "react-bootstrap";
import { Router,Route, Link } from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';
import Quiz from './Quiz';
import output from './output.json';
import Mypage from './Mypage.js';

const lastQuiz = () => {
  return (
    <div >
      <header className="lastQuiz">
        <a> 지난 퀴즈 불러오기 </a>
      </header>
      <body>
        render();
        <div>
            <Quiz title = {this.PaymentResponse.title} />
            <Quiz description = {this.PaymentResponse.description} />
            <Quiz subject = {this.PaymentResponse.subject} />
            <Quiz quiz = {this.PaymentResponse.quiz} />
        </div>
      </body>
    </div>
  );
}

export default lastQuiz;
