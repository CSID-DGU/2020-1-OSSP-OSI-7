import React, {Fragment, useState, useEffect} from 'react';
import { Link,Redirect } from 'react-router-dom';
import styled from 'styled-components';
import {Form,Col,InputGroup, Button} from 'react-bootstrap';
import {FaUser, FaPaperPlane, FaLock, FaUnlockAlt, FaGrinSquint} from 'react-icons/fa'
import {IoMdSchool} from 'react-icons/io'
import {check, login, registerTo} from '../../lib/api/auth'
import CenteredModal from '../common/CenteredModal';
import {currentUser, isAuthenticated} from '../atoms';

import {useRecoilState} from 'recoil';


const AuthFormBlock = styled.div`

`;




const FieldForm = ({placeholder, icon, type, onChange, handleBlur, feedback, authType}) => (
    <Form.Group className="authform_group">
        <InputGroup>
            <InputGroup.Prepend>
            <InputGroup.Text>{icon}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type={type} id={placeholder} placeholder={placeholder} required onBlur={authType === "register" && handleBlur} onChange={(e)=>onChange(e.target.value)}/>
            <Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback>
        </InputGroup>
    </Form.Group>
);


const AuthForm = ({type, location})=>{
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [student_code, setStudentCode] = useState("");
    const [username, setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [validated, setValid] = useState(false); 
    const [isUsername,setCheck] = useState(false);

    const [modalShow, setModalShow] = useState(false);

    const [user, setUser] = useRecoilState(currentUser);
    const [authenticated, setAuth] = useRecoilState(isAuthenticated);

    


    useEffect(()=>{
        if(type === "register"){
        const formReference = document.getElementById('USERNAME');
        if(isUsername){
            formReference.setCustomValidity("user Already Exist");
        }   else {
            formReference.setCustomValidity("");
        }
    }
    }, [isUsername]);

    useEffect(()=>{
        if(type === "register"){
        const pwCheckReference = document.getElementById('PASSWORD CHECK');
        const pwReference = document.getElementById('PASSWORD');
        if (password !== passwordCheck) {
            setValid(true);
            pwReference.setCustomValidity("not smae");
            pwCheckReference.setCustomValidity("not smae");
        }else {
            pwReference.setCustomValidity("");
            pwCheckReference.setCustomValidity("");
        }
    }
    },[password,passwordCheck]);


    const { from } = location.state || { from: { pathname: "/" } }
    if (authenticated) return <Redirect to={from} />

    const handleClick = () =>{
        const formReference = document.getElementById('authForm');
        if (formReference.checkValidity() === false){
            console.log("stay");
        }else{
            console.log(formReference);
            if(type === "login") {
                handleSignIn();
            }else if (type ==="register"){
                handleSignUp();
            }
        }
        setValid(true);
    }

    const handleSignIn = () =>{
        login({username,password}).then((res)=>{
            setUser(res);
            setAuth(true);
          }).catch((e)=>alert(e));
    }

    const handleSignUp = () =>{
        registerTo({username,password, nickname, student_code, email}).then((res)=>{
            console.log("hello" + res);
            setModalShow(true);
        }).catch((e)=>{
                alert("Failed to Register");
                setEmail("");
                setNickname("");
                setStudentCode("");
                setPassword("");
                setUsername("");
        });

    }

    const handleBlur = (e)=>{
        const value = e.target.value;
        console.log(value);
        check(value).then((res)=>setCheck(true)).catch(()=>setCheck(false));
        setValid(true);
    }

    return (
        <Fragment>
        <AuthFormBlock>
            <Form noValidate validated={validated} id="authForm">
                <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                {type === 'register' ?
                (<p>Please fill in this form to create an account!</p>)
                :(<p>Pease fill your Email and password</p>)
                }
                <hr/>
                <FieldForm authType={type} feedback={"already exist username"} placeholder={"USERNAME"} icon={<FaUser/>} onChange={setUsername} handleBlur={handleBlur} type={"username"}/>
                {type === 'register' && 
                <Fragment>
                    <FieldForm authType={type} placeholder={"E-MAIL"} icon={<FaPaperPlane/>} onChange={setEmail} type={"email"}/>
                    <FieldForm authType={type} placeholder={"NICKNAME"} icon={<FaGrinSquint/>} onChange={setNickname} type={"nickname"}/>
                    <FieldForm authType={type} placeholder={"STUDENT_CODE"} icon={<IoMdSchool/>} onChange={setStudentCode} type={"studentCode"}/>
                    <hr/>
                </Fragment>
                }
                <FieldForm authType={type} placeholder={"PASSWORD"} icon={<FaLock/>} onChange={setPassword} type={"password"}/>
                
                {type === 'register' && 
                    <FieldForm authType={type} feedback={"password is not same"} placeholder={"PASSWORD CHECK"} icon={<FaUnlockAlt/>}  onChange={setPasswordCheck} type={"password"}/>
                }

                <Form.Group>
                <Button as={Col} md={12} variant="info" type="submit"  onClick={()=>handleClick()}>{type === "register" ? "SIGN UP" : "LOGIN"}</Button>
                </Form.Group>
            </Form>
            {type === 'register' ?( 
                <div>Already have an account?  <Link to='/login'>Login Here</Link></div>
            ) : (
                <div><Link to='/register'>Register Here</Link></div>
            )
            }
        </AuthFormBlock>
        <CenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}/>
        </Fragment>
    );
};


export default AuthForm;