import React from "react";
import AuthBase from './AuthBase';
import AuthForm from './AuthForm';

const Register = (props) =>{
    return (
        <AuthBase>
            <AuthForm type='register' {...props}/>
        </AuthBase>
    );
}

export default Register;