import React,{useState, useEffect,Fragment} from 'react';
import { Route, Link, Switch, useHistory} from 'react-router-dom';
import {Navbar, Nav, Image, Container, NavDropdown} from 'react-bootstrap';
import QuizTemplate from './quiz/QuizTemplate';
import QuizSetListContainer from './quiz/QuizSetListContainer';
import Home from './Home';
import Login from './auth/Login';
import Register from './auth/Register';
import AuthRoute from './auth/AuthRoute';
import NotFound from './NotFound';
import TestQuiz from './quiz/TestQuiz';
import Mypage from './mypage/Mypage';
import ClassRoom from './class/ClassRoom';
import {login, registerTo} from '../lib/api/auth';
import {getAvatar} from '../lib/api/mypage';
import {useRecoilState} from 'recoil';
import {currentUser, isAuthenticated, userAvatar} from './atoms';

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
  const [avatar, setAvatar] = useRecoilState(userAvatar);
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
      getAvatar(user).then((res)=>setAvatar(res.data.avatar_url));
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

    <Navbar collapseOnSelect expand="sm" bg="dark" sticky="top" className="nav__bar" variant="dark">
      <Link to="/">
        <Navbar.Brand className="nav__bar">
        <img
          alt=""
          src="/logoEmoji.png"
          className="d-inline-block align-top nav__img"
        />{' '}
        DQUIZ
      </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse>

      <Nav  className="mr-auto">
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

        
        <Link to="/mypage">
        <Navbar.Brand className="nav__bar">
        <img
        alt=""
        src={avatar}
        className="d-inline-block align-top nav__img profile__thumb"
        />{' '}
        {user}
        </Navbar.Brand>
        </Link>
        
        <NavDropdown title=""  alignRight id="collasible-nav-dropdown">
        <NavDropdown.Item className="nav__dropdown" onClick={()=>logOut()}>LOGOUT</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item className="nav__dropdown">not yet</NavDropdown.Item>
        </NavDropdown>



        </Fragment>
        )
      }
      </Nav>
      </Navbar.Collapse>

    </Navbar>


    <Switch>
      <Route path="/" component={Home} exact/>
      <AuthRoute authenticated={authenticated} path="/quiz" component={QuizSetListContainer} exact/>
      
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
      <AuthRoute authenticated={authenticated} path="/class/:classId" component={ClassRoom}/>}
      />
      
      <Route component={NotFound} />
        </Switch>
    </>
  );
}

export default App;
