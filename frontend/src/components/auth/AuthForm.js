import React, {Fragment, useState} from 'react';
import { Link,Redirect } from 'react-router-dom';
import styled from 'styled-components';
import {Form,Col,InputGroup, Button} from 'react-bootstrap';
import {FaUser, FaPaperPlane, FaLock, FaUnlockAlt, FaGrinSquint} from 'react-icons/fa'
import {IoMdSchool} from 'react-icons/io'


const AuthFormBlock = styled.div`

`;


const FieldForm = ({placeholder, icon, type, onChange}) => (
    <Form.Group className="authform_group">
        <InputGroup>
            <InputGroup.Prepend>
            <InputGroup.Text>{icon}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type={type} placeholder={placeholder} required  onChange={(e)=>onChange(e.target.value)}/>
        </InputGroup>
    </Form.Group>
);


const AuthForm = ({authenticated, type, handleSubmit, location})=>{
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [student_code, setStudentCode] = useState("");
    const [username, setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const { from } = location.state || { from: { pathname: "/" } }
    if (authenticated) return <Redirect to={from} />

    const handleClick = () =>{
        if(type === "login") {
            handleSignIn();
        }else if (type ==="register"){
            handleSignUp();
        }
    }

    const handleSignIn = () =>{
        try{
            handleSubmit({username, password});
        } catch{
            alert("Failed to login");
            setEmail("");
            setPassword("");
        }
    }

    const handleSignUp = () =>{
        try{
            handleSubmit({username,password, nickname, student_code, email});
        } catch{
            alert("Failed to Register");
            setEmail("");
            setNickname("");
            setStudentCode("");
            setPassword("");
            setUsername("");
        }
    }

    return (
        <AuthFormBlock>
            <Form>
                <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                {type === 'register' ?
                (<p>Please fill in this form to create an account!</p>)
                :(<p>Pease fill your Email and password</p>)
                }
                <hr/>
                <FieldForm placeholder={"USERNAME"} icon={<FaUser/>} onChange={setUsername} type={"text"}/>
                {type === 'register' && 
                <Fragment>
                    <FieldForm placeholder={"E-MAIL"} icon={<FaPaperPlane/>} onChange={setEmail} type={"email"}/>
                    <FieldForm placeholder={"NICKNAME"} icon={<FaGrinSquint/>} onChange={setNickname} type={"nickname"}/>
                    <FieldForm placeholder={"STUDENT_CODE"} icon={<IoMdSchool/>} onChange={setStudentCode} type={"studentCode"}/>
                    <hr/>
                </Fragment>
                }
                <FieldForm placeholder={"PASSWORD"} icon={<FaLock/>} onChange={setPassword} type={"password"}/>
                
                {type === 'register' && 
                    <FieldForm placeholder={"PASSWORD CHECK"} icon={<FaUnlockAlt/>}  onChange={setPasswordCheck} type={"password"}/>
                }

                <Form.Group>
                <Button as={Col} md={12} variant="info" type="submit" onClick={()=>handleClick()}>{type === "register" ? "SIGN UP" : "LOGIN"}</Button>
                </Form.Group>
            </Form>
            {type === 'register' ?( 
                <div>Already have an account?  <Link to='/login'>Login Here</Link></div>
            ) : (
                <div><Link to='/register'>Register Here</Link></div>
            )
            }
        </AuthFormBlock>
    );
};


export default AuthForm;