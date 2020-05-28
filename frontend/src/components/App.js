import React,{useState, useEffect,Fragment} from 'react';
import { Route, Link, Switch, useHistory} from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';
import QuizTemplate from './quiz/QuizTemplate';
import QuizSetList from './quiz/QuizSetList';
import Home from './Home';
import Login from './auth/Login';
import Register from './auth/Register';
import AuthRoute from './auth/AuthRoute';
import NotFound from './NotFound';
import TestQuiz from './quiz/TestQuiz';
import Mypage from './mypage/Mypage';
import {login, registerTo} from '../lib/api/auth';
import {useRecoilState} from 'recoil';
import {currentUser, isAuthenticated} from './atoms';

const useTitle = (initialTitle)=>{
  const[title,setTitle] = useState(initialTitle);
  const updateTitle = () =>{
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]);
  return setTitle;
} 

const App = () => {
  const titleUpdator = useTitle("DQUIZ");
  const [user, setUser] = useRecoilState(currentUser);
  const [authenticated, setAuth] = useRecoilState(isAuthenticated);
  let history = useHistory();
  // const authenticated = user !== null;

  useEffect (()=>{
      const local = JSON.parse(localStorage.getItem("user_info"));
      if(local){
        setUser(local.user);
        setAuth(true);
      }  else {
        setAuth(false);
      }
      // setUser(local.user);
  }, [user])
  // }

  // const logIn = ({username, password}) =>setUser("user");
  const logIn = ({username, password}) => {
    login({username,password}).then((res)=>{
      setUser(res);
      setAuth(true);
    }).catch(()=>alert("login fail"));
  };
  const logOut = () =>{
    setUser(null);
    setAuth(false);
    localStorage.removeItem("user_info");
  };
  const register = ({username,password, nickname, student_code, email}) => {
    registerTo({username,password, nickname, student_code, email});
    history.push('/login');
  };


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
      { !authenticated ?
        (<Fragment>      
        <Nav.Link><Link to="/login">LOGIN</Link></Nav.Link>
        <Nav.Link><Link to="/register">REGISTER</Link></Nav.Link>
        </Fragment>)
      : (
        <Fragment>
          <Nav.Link onClick={()=>logOut()}>LOGOUT</Nav.Link>
          <Nav.Link><Link to="/mypage">{user}</Link></Nav.Link>
        </Fragment>
        )
      }
      </Nav>
    </Navbar>


    <Switch>
      <Route path="/" component={Home} exact/>
      <AuthRoute authenticated={authenticated} path="/quiz" component={QuizSetList} exact/>
      
      <Route path="/login" render={props => (
          <Login authenticated={authenticated} handleSubmit={logIn} {...props} />
        )}/>
      
      <Route path="/register" render={props => (
          <Register authenticated={authenticated} handleSubmit={register} {...props} />
          )}/>
      
      <AuthRoute authenticated={authenticated} path="/create"
        render={props => <QuizTemplate {...props} />}
      />
      <AuthRoute authenticated={authenticated} path="/quiz/:quizSetId" component={TestQuiz}/>}
      />
      <AuthRoute authenticated={authenticated} path="/mypage" component={Mypage}/>}
      />
      
      <Route component={NotFound} />
        </Switch>
    </>
  );
}

export default App;
