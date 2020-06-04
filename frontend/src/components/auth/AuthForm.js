import React, {Fragment, useState, useEffect, useRef, forwardRef,useMemo } from 'react';
import { Link,Redirect } from 'react-router-dom';
import styled from 'styled-components';
import {Form,Col,InputGroup, Button} from 'react-bootstrap';
import {FaUser, FaPaperPlane, FaLock, FaUnlockAlt, FaGrinSquint} from 'react-icons/fa'
import {IoMdSchool} from 'react-icons/io'
import {check, login, registerTo} from '../../lib/api/auth'
import CenteredModal from '../common/CenteredModal';
import {currentUser, isAuthenticated} from '../atoms';
import {useForm} from 'react-hook-form';


import {useRecoilState} from 'recoil';


const AuthFormBlock = styled.div`

`;
const FieldForm = forwardRef(({validated, placeholder, icon, type, onChange, onBlur, authType, name, value, error},ref) => (
    <Form.Group className="authform_group">
        <InputGroup>
            <InputGroup.Prepend>
            <InputGroup.Text>{icon}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control value={value} onChange={(e)=>{onChange(e)}} name={name} ref={ref} type={type} id={placeholder}  placeholder={placeholder} 
                onBlur={onBlur}
                className={!error ? "form-control:valid is-valid" : "form-control:invalid is-invalid was-validated"}
            />
            <div className="invalid-feedback">{error}</div>
        </InputGroup>
    </Form.Group>
));



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

    const formReference = useRef();

    const {register, handleSubmit, errors, triggerValidation} = useForm();


    // useCustomValidity(usernameReference, "hello");
    // useEffect(()=>{
    //     if(type === "register"){
    //         if(isUsername && usernameReference.current){
    //             // useCustomValidity(usernameReference, "User Already exist");
    //             usernameReference.current.setCustomValidity("user Already Exist");
    //         }   else {
    //             // useCustomValidity(usernameReference);
    //             usernameReference.current.setCustomValidity("");
    //         }
    // }
    // }, [isUsername]);
    
    // useEffect(()=>{
    //     if(type === "register" && pwReference.current){
    //         if (password !== passwordCheck) {
    //             setValid(true);
    //             // useCustomValidity(pwReference, "not same");
    //             // useCustomValidity(pwCheckReference, "not same");
    //             pwReference.current.setCustomValidity("not smae");
    //             pwCheckReference.current.setCustomValidity("not smae");
    //         }else {
    //             // useCustomValidity(pwReference);
    //             // useCustomValidity(pwCheckReference);
    //             pwReference.current.setCustomValidity("");
    //             pwCheckReference.current.setCustomValidity("");
    //     }
    // }
    // },[password,passwordCheck]);


    const { from } = location.state || { from: { pathname: "/" } }
    if (authenticated) return <Redirect to={from} />

    const handleSignIn = () =>{
        login({username,password}).then((res)=>{
            setUser(res);
            setAuth(true);
          }).catch((e)=>alert(e));
    }

    const handleSignUp = () =>{
        registerTo({username,password, nickname, student_code}).then((res)=>{
            console.log("hello" + res);
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
        console.log(result);
        return result
    }

    // const isUser = useMemo(handleBlur, [username]);

    const onSubmit = (data) => {
        console.log(data);
        // setValid(true);
        if(type === "login") {
            handleSignIn();
        }else if (type ==="register"){
            handleSignUp();
        }
    };

    const onChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        if(name === "username") {
            setUsername(value);
        } else if (name ==="nickname"){
            setNickname(value);
        } else if (name === "student_code"){
            setStudentCode(value);
        } else if(name==="password"){
            setPassword(value);
        } else if(name==="passwordCheck"){
            setPasswordCheck(value);
        }

    }

    const isPasswordSame = () =>{
        return (
            (!!passwordCheck && !!password) &&
            password !== passwordCheck ? false: true
        )
    }


    return (
        <Fragment>
        <AuthFormBlock>
            <Form id="authForm" ref={formReference}>
                <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                {type === 'register' 
                ?(
                    // register
                    <Fragment>
                        <p>Please fill in this form to create an account!</p>
                        <hr/>
                        <FieldForm validated={validated} value={username} 
                            ref={register({required: true,
                            validate: async value => await handleBlur(value) == true})}
                            error={errors.username && "username is required"}
                            name={"username"} authType={type} placeholder={"E-MAIL"} icon={<FaUser/>} onChange={onChange}
                            onBlur={async () => await triggerValidation("username")} type={"email"}/>
                        
                        <FieldForm validated={validated} value={nickname}
                            ref={register({required: true, minLength: 6})}
                            error={errors.nickname && errors.nickname.type === "minLength" && ("too short")}
                            name={"nickname"} authType={type} placeholder={"NICKNAME"} icon={<FaGrinSquint/>} onChange={onChange} type={"nickname"}/>
                        
                        <FieldForm validated={validated} value={student_code} 
                            ref={register({required: true, minLength:9})}
                            error = {errors.student_code && "student_code is required"}
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
        onHide={() => setModalShow(false)}/>
        </Fragment>
    );
};


export default AuthForm;