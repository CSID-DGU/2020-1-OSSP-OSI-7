import React from 'react';
import { Route, Link } from 'react-router-dom';
import Quiz from './Quiz';
import Home from './Home';
import {Navbar, Nav} from 'react-bootstrap';


const App = () => {
  return (
    <>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossorigin="anonymous"/>
    <Navbar bg="dark" sticky="top">
    <Nav className="mr-auto">
      <Nav.Link><Link to="/">HOME</Link></Nav.Link>
      <Nav.Link><Link to="/quiz">QUIZ</Link></Nav.Link>
    </Nav>
    <Nav>
      <Nav.Link>USER</Nav.Link>
    </Nav>
    </Navbar>
      <Route path="/" component={Home} exact/>
      <Route path="/quiz" component={Quiz}/> 
    </>
  );
}

export default App;
