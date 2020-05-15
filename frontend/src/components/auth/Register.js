import React, {Fragment} from "react";
import AuthBase from './AuthBase';
import AuthForm from './AuthForm';

const Register = (props) =>{
    return (
        <AuthBase>
            <AuthForm type='Register' {...props}/>
        </AuthBase>
    );
}

export default Register;