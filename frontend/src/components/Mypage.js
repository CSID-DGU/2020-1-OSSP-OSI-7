import React, { useState, useEffect, Fragment, Component} from "react";
import {Button, Container, ButtonToolbar, ButtonGroup,Form, Row,Col} from "react-bootstrap";
import { Route, Link, withRouter,Switch,NavLink } from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';
import Quiz from './Quiz';
import output from './output.json';
import { render } from "@testing-library/react";

class Mypage extends React.Component {
  componentDidMount() {
    console.log(this.props);
  }
  render(){
    const activeStyle = {
      color : 'skyBlue'
    };
    return (
      <div>
        <header className="Mypage">
          <a> 마이 페이지 </a>
        </header>
        <body>
          <Link to="/Home.js"> Home </Link>
          <a onClick={history.goBack}>Previous Page</a>
          <Link to="/lastQuiz.js"> 지난 퀴즈 불러오기 </Link>
        </body>
      </div>
    );
  }
  }

export default Mypage;
