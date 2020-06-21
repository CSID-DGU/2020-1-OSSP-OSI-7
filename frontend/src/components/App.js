import React,{useState, useEffect,Fragment} from 'react';
import { Route, Link, Switch, useHistory, useLocation} from 'react-router-dom';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import QuizTemplate from './quiz/QuizTemplate';
import QuizSetListContainer from './quiz/QuizSetListContainer';
import Home from './Home';
import Login from './auth/Login';
import Register from './auth/Register';
import AuthRoute from './auth/AuthRoute';
import NotFound from './NotFound';
import TestQuiz from './quiz/TestQuiz';
import TestQuizResult from './quiz/TestQuizResult';
import FooterContent from './FooterContent';
import Mypage from './mypage/Mypage';
import ClassRoom from './class/ClassRoom'
import {getAvatar} from '../lib/api/mypage';
import {getUserInfo} from '../lib/api/auth';
import {useRecoilState, useRecoilValue} from 'recoil';
import {currentUser, currentUserInfo, isAuthenticated, userAvatar, tokenExpiredate, userAuth} from './atoms';

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
  const [userinfo, setUserInfo] = useRecoilState(currentUserInfo);
  const auth = useRecoilValue(userAuth);
  const titleUpdator = useTitle("DQUIZ");
  const [user, setUser] = useRecoilState(currentUser);
  const [authenticated, setAuth] = useRecoilState(isAuthenticated);
  const [tokenExp, setExp] = useRecoilState(tokenExpiredate);
  let history = useHistory();
  const location = useLocation();
  // const authenticated = user !== null;

  useEffect (()=>{
      const local = JSON.parse(localStorage.getItem("user_info"));
      if(local){
        setUser(local.user);
        setAuth(true);
        setExp(local.exp);
      }  else {
        setAuth(false);
        setUser(null);
      }
      // setUser(local.user);
      if(user !== null){
        getAvatar(user.split("@")[0]).then((res)=>setAvatar(res.data.avatar_url));
        getUserInfo(user).then((r)=>setUserInfo(r.data));

      }
    }, [user])
    
    useEffect (()=>{
      if(localStorage.getItem('user_info')){
        const local = JSON.parse(localStorage.getItem("user_info"));
        if( Date.now() > local.exp){
          console.log("token check expired");
          alert("token is expired");
          logOut();
        } else{
          // console.log("token is ok 😆 %c/////", 'color:green; background-color:green; padding: 0 10px; border-radius: 100px;');
          console.log("%ctoken is ok 😆 %c           ",'font-size: 20px', [
            'background-image: url("https://media.giphy.com/media/oobNzX5ICcRZC/giphy.gif")',
            'background-size: cover',
            'color: black',
            'font-weight: 600',
            'padding: 10px 20px',
            'line-height: 35px'
            ].join(';'));
        }

      }
    }, [location]);


  const logOut = () =>{
    setUser(null);
    setAuth(false);
    localStorage.removeItem("user_info");
  };




  return (
    <>

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
      <Route path="/login" render={props => (
          <Login authenticated={authenticated} {...props} />
        )}/>
      
      <Route path="/register" render={props => (
          <Register authenticated={authenticated} {...props} />
          )}/>
      {
        auth && 
        <AuthRoute authenticated={authenticated} path="/create"
        render={props => <QuizTemplate {...props} />}
        />
      }
      <AuthRoute authenticated={authenticated} path="/quiz/:quizSetId" component={TestQuiz} exact/>
      <AuthRoute authenticated={authenticated} path="/quiz/:quizSetName/result" component={TestQuizResult} exact/>
      <AuthRoute authenticated={authenticated} path="/mypage" component={Mypage}/>
      <AuthRoute authenticated={authenticated} path="/class/:classId" component={ClassRoom}/>
      
      <Route component={NotFound} />
        </Switch>
        <footer className="footer">
          <FooterContent/>
        </footer>
    </>
  );
}

export default App;
