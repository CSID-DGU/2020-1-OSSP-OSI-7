import React from 'react';
import { Route } from 'react-router-dom';
import Quiz from './Quiz';
import Home from './Home';


const App = () => {
  return (
    <>
      <Route path="/" component={Home} exact/>
      <Route path="/quiz" component={Quiz}/> 
    </>
  );
}

export default App;
