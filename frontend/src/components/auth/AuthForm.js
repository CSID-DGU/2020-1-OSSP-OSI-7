import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {Form,Col,Row,InputGroup, Button} from 'react-bootstrap';
import {FaUser, FaPaperPlane, FaLock, FaUnlockAlt} from 'react-icons/fa'


const AuthFormBlock = styled.div`

`;


const FieldForm = ({placeholder, icon, type}) => (
    <Form.Group className="authform_group">
        <InputGroup>
            <InputGroup.Prepend>
            <InputGroup.Text>{icon}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type={type} placeholder={placeholder} required />
        </InputGroup>
    </Form.Group>
);


const AuthForm = ({type})=>{
    return (
        <AuthFormBlock>
            <Form>
                <h2>{type}</h2>
                {type === 'Register' ?
                (<p>Please fill in this form to create an account!</p>)
                :(<p>Pease fill your Email and password</p>)
                }
                <hr/>
                <FieldForm placeholder={"E-MAIL"} icon={<FaPaperPlane/>} type={"email"}/>
                {type === 'Register' && 
                <Fragment>
                    <FieldForm placeholder={"USERNAME"} icon={<FaUser/>} type={"text"}/>
                    <hr/>
                    </Fragment>
                }
                <FieldForm placeholder={"PASSWORD"} icon={<FaLock/>} type={"password"}/>
                {type === 'Register' && 
                    <FieldForm placeholder={"PASSWORD CHECK"} icon={<FaUnlockAlt/>} type={"password"}/>
                }
                <Form.Group>
                <Button as={Col} md={12} variant="info" type="submit">SIGN UP</Button>
                </Form.Group>
            </Form>
            {type === 'Register' ?( 
                <div>Already have an account?  <Link to='/login'>Login Here</Link></div>
            ) : (
                <div><Link to='/register'>Register Here</Link></div>
            )
            }
        </AuthFormBlock>
    );
};

export default AuthForm;