import React, {Fragment} from "react";
import AuthBase from './AuthBase';
import AuthForm from './AuthForm';

const Register = () =>{
    return (
        <AuthBase>
            <AuthForm type='Register'/>
        </AuthBase>
    );
}

export default Register;