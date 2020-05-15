import React from "react";
import AuthBase from './AuthBase';
import AuthForm from './AuthForm';

const Login = (props) =>{
    return (
        <AuthBase>
            <AuthForm type='Login' {...props}/>
        </AuthBase>
    );
}
export default Login;