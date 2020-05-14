import React,{Fragment} from "react";
import AuthBase from './AuthBase';
import AuthForm from './AuthForm';

const Login = () =>{
    return (
        <AuthBase>
            <AuthForm type='Login'/>
        </AuthBase>
    );
}
export default Login;