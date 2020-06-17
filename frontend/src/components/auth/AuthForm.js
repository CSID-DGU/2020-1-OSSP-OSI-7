import React, {Fragment, useState, forwardRef } from 'react';
import { Link,Redirect,useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {Form,Col,InputGroup, Button, ListGroup} from 'react-bootstrap';
import {FaUser, FaLock, FaUnlockAlt, FaGrinSquint} from 'react-icons/fa'
import {IoMdSchool} from 'react-icons/io'
import {check, login, registerTo, getUserInfo} from '../../lib/api/auth'
import CenteredModal from '../common/CenteredModal';
import {currentUser, isAuthenticated} from '../atoms';
import {useForm} from 'react-hook-form';
import { useSpring, animated as a } from "react-spring";
import {useRecoilState} from 'recoil';
import AuthModal from './AuthModal';

const AuthFormBlock = styled.div`

`;
const FieldForm = forwardRef(({placeholder, icon, type, onChange, onBlur, name, value, error, children},ref) => (
    <Form.Group className="authform_group">
        <InputGroup>
            <InputGroup.Prepend>
            <InputGroup.Text>{icon}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control value={value} onChange={(e)=>{onChange(e)}} name={name} ref={ref} type={type} id={placeholder}  placeholder={placeholder} 
                onBlur={onBlur}
                className={!error ? (value && "form-control:valid is-valid") : "form-control:invalid is-invalid was-validated"}
            />
            <div className="invalid-feedback">{error}</div>
        </InputGroup>
        {children}
    </Form.Group>
));


const SelectBtn = ({value, onClick, onFocus}) =>{
    const mailType = ["dongguk.edu", "dgu.ac.kr", "naver.com", "gmail.com"];
    const isValid = (value && value.indexOf("@") === -1);
    const contentProps = useSpring({
        from:{height:0},
        to:{height: isValid?200:0} 
    })

    return (
        <a.div className="selectList" style={contentProps}>
        {isValid &&
        <ListGroup>
        {
            mailType.map((m)=>(<ListGroup.Item onClick={async ()=>{onClick("@"+m); await onFocus();}}>{value}@{m}</ListGroup.Item>))
        }
        </ListGroup>
        }
        </a.div>
    );
}


const AuthForm = ({type, location})=>{

    const [nickname, setNickname] = useState("");
    const [student_code, setStudentCode] = useState("");
    const [username, setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    // submit 시 발동
    const [validated, setValid] = useState(false); 

    const [modalShow, setModalShow] = useState(false);

    const [user, setUser] = useRecoilState(currentUser);
    const [authenticated, setAuth] = useRecoilState(isAuthenticated);

    const {register, handleSubmit, errors, triggerValidation} = useForm();
    let history = useHistory();
    const { from } = location.state || { from: { pathname: "/" } }
    if (authenticated) return <Redirect to={from} />

    const handleSignIn = () =>{
        login({username,password}).then((res)=>{
            getUserInfo(username);
            setUser(res);
            setAuth(true);
          }).catch((e)=>alert(e));
    }

    const handleSignUp = () =>{
        registerTo({username,password, nickname, student_code}).then((res)=>{
            setModalShow(true);
        }).catch((e)=>{
                alert("Failed to Register");
                setNickname("");
                setStudentCode("");
                setPassword("");
                setUsername("");
        });

    }

    const handleBlur = async (value)=>{
        const result = await check(value).then((res)=>{return false}).catch(()=>{return true});
        return result
    }


    const onSubmit = (data) => {
        if(type === "login") {
            handleSignIn();
        }else if (type ==="register"){
            handleSignUp();
        }
    };

    const onChange = async (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        if(name === "username") {
            setUsername(value);
        } else if (name ==="nickname"){
            setNickname(value);
            await triggerValidation("nickname");
        } else if (name === "student_code"){
            // setModalShow(true); //modal test
            setStudentCode(value);
            await triggerValidation("student_code");
        } else if(name==="password"){
            await setPassword(value);
            if(passwordCheck){
                await triggerValidation("passwordCheck");
                await triggerValidation("password");
            }
        } else if(name==="passwordCheck"){
            await setPasswordCheck(value);
            await triggerValidation("passwordCheck");
            await triggerValidation("password");
        }

    }

    const isPasswordSame = () =>{
        return (
            (!!passwordCheck && !!password) &&
            password === passwordCheck ? true: false
        )
    }

    const onFocus = () =>{
        document.getElementsByName('username')[0].focus();
    }

    const EmailBtnClick = (value) => {
        setUsername(username+value);
    }



    return (
        <Fragment>
        <AuthFormBlock className={modalShow && "modal_blur"}>
            <Form id="authForm">
                <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                {type === 'register' 
                ?(
                    // register
                    <Fragment>
                        <p>Please fill in this form to create an account!</p>
                        <hr/>
                        <FieldForm validated={validated} value={username} 
                            ref={register({required: true,
                            validate: async value => await handleBlur(value) == true,
                            pattern:/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
                            })}
                            error={errors.username && (errors.username.type === "pattern" ? "this is not a email type" : (errors.username.type === "validate" ? "user is already exist":"username is required"))}
                            name={"username"} authType={type} placeholder={"E-MAIL"} icon={<FaUser/>} onChange={onChange}
                            onBlur={async () => await triggerValidation("username")} type={"email"}>
                            {
                                // (username && username.indexOf("@") === -1) && 
                                <SelectBtn value={username} onClick={EmailBtnClick} onFocus={onFocus}/> 
                            }
                            </FieldForm>
                        

                        <FieldForm validated={validated} value={nickname}
                            ref={register({required: true, minLength: 6})}
                            error={errors.nickname && errors.nickname.type === "minLength" && ("too short")}
                            name={"nickname"} authType={type} placeholder={"NICKNAME"} icon={<FaGrinSquint/>} onChange={onChange} type={"nickname"}/>
                        
                        <FieldForm validated={validated} value={student_code} 
                            ref={register({required: true, minLength:10})}
                            error = {errors.student_code && (errors.student_code.type === "minLength" ? "too short!" : "student_code is required") }
                            name={"student_code"} authType={type} placeholder={"STUDENT_CODE"} icon={<IoMdSchool/>} onChange={onChange} type={"studentCode"}/>
                        <hr/>
                        <FieldForm validated={validated} value={password}
                            ref={register({required: true,
                            validate: value => isPasswordSame() })}
                            error={errors.password && "password is required"}
                            name={"password"} authType={type} placeholder={"PASSWORD"} icon={<FaLock/>}  onChange={onChange} type={"password"}
                            onBlur={async () => {await triggerValidation("password");await triggerValidation("passwordCheck")}}/>
                            
                            <FieldForm validated={validated} value={passwordCheck} 
                            ref={register({required: true,
                            validate: value => isPasswordSame()})}
                            error={errors.passwordCheck && "password is required"}
                            name={"passwordCheck"} authType={type} placeholder={"PASSWORD CHECK"} icon={<FaUnlockAlt/>}  onChange={onChange} type={"password"}
                            onBlur={async () => {await triggerValidation("password");await triggerValidation("passwordCheck")}}/>
                        </Fragment>                    
                        )
                :(
                    // login
                    <Fragment>
                    <p>Pease fill your Email and password</p>
                    <hr/>
                    <FieldForm validated={validated} value={username} 
                    ref={register({required: true,
                        validate: async value => await handleBlur(value) == false})}
                        // 없는 아이디시 알려줌
                        error={errors.username && (errors.username.type === "validate" ? "not exist username":"username is required" )}
                        name={"username"} authType={type} placeholder={"E-MAIL"} icon={<FaUser/>} onChange={onChange}
                        onBlur={async () => await triggerValidation("username")} type={"email"}/>
                        
                    <FieldForm validated={validated} value={password}
                        ref={register({required: true})}
                        error={errors.password && "password is required"}
                        name={"password"} authType={type} placeholder={"PASSWORD"} icon={<FaLock/>}  onChange={onChange} type={"password"}
                        />
                    </Fragment>
                )
                }
                    <Button type="submit" as={Col} md={12} variant="info" onClick={handleSubmit(onSubmit)}>{type === "register" ? "SIGN UP" : "LOGIN"}</Button>
            </Form>


            {type === 'register' ?( 
                <div>Already have an account?  <Link to='/login'>Login Here</Link></div>
            ) : (
                <div><Link to='/register'>Register Here</Link></div>
            )}
        </AuthFormBlock>


        <CenteredModal
            show={modalShow}
            onHide={() => history.push('/')}
            body="helloworld">
                <AuthModal onClick={() => history.push('/login')} username={username} />
        </CenteredModal>


        </Fragment>
    );
};


export default AuthForm;