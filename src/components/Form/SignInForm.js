import React, { useState } from 'react';
import './SignUpForm.css';
import firebase from "firebase/app";
import "firebase/auth";

import { Formik, Form } from 'formik';
import TextField from './TextField';
import * as Yup from 'yup';

import firebaseConfig from '../../firebase.config';
import { Link } from 'react-router-dom';

if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig)
}

const SignInForm = () => {
    const [user, setUser] = useState({
        isSignedIn: false,
        email: '',
        password: '',
        error: '',
        success: false
    })

    const validate = Yup.object({
        email: Yup.string()
        .email('Email is Invalid')
        .required('Email is Required'),
        password: Yup.string()
        .min(6, 'Password must be at least six characters')
        .required('Password is Required'),
    })
    return (
        <div>
            <Formik
            initialValues={{
                email: '',
                password: ''
            }}
            validationSchema={validate}
            onSubmit={value =>{
                setUser(value)
                if(value.email && value.password){
                    firebase.auth().signInWithEmailAndPassword(value.email, value.password)
                    .then(res => {
                        const newUserInfo = {...user}
                        newUserInfo.success = true;
                        newUserInfo.error = "User Logged in Successfully";                        
                        setUser(newUserInfo);
                        console.log("Signed In user Info", res.user)
                    })
                    .catch((error) => {
                        const newUserInfo = {...user}
                        newUserInfo.success = false;
                        newUserInfo.error = error.message;
                        setUser(newUserInfo)
                    });
                }
            }}
        >
            
            {formik =>(
                <div className="form-body">
                    <div className="form-body-style mt-5 p-4 pl-5">
                        {user.success ? <p style={{color:'green'}}>{user.error}</p> : <p style={{color:'red'}}>{user.error}</p>}
                        <h1 className="my-4 font-weight-bold-display-4">Login</h1>
                        <Form onSubmit={formik.handleSubmit} className="form-body-main mr-4">
                            <TextField name="email" type="email" placeholder="Email"></TextField>
                            <TextField name="password" type="password" placeholder="Password"></TextField>
                            {/* {
                            newUser ? <button type="submit"  className="btn btn-warning mt-5 w-100">Create an Account</button> 
                                    : <button type="submit" className="btn btn-warning mt-5 w-100">Login</button>
                            } */}
                            
                            <button type="submit"  className="btn btn-warning mt-5 w-100">Login</button>

                            {/* <p className="text-center mt-4">{newUser ? "Already Have an Account?" : "Don't have Account?" } 
                                <span 
                                    onClick={()=> setNewUser(!newUser)} 
                                    style={{color:'orange', cursor: 'pointer', fontWeight:'bold'}}>{newUser ? " Login" : " Sign Up"}
                                </span>
                            </p> */}

                            <p className="text-center mt-4">"Don't Have an Account?" 
                                <Link to="/signup"
                                    style={{color:'orange', cursor: 'pointer', fontWeight:'bold'}}>Sign Up
                                </Link>
                            </p>
                        </Form>
                    </div>
                    <div className="or mt-5">
                        <div className="lines mb-5">
                            <p>Or</p>
                        </div>
                        <button className="btn btn-warning w-100 button-custom button-custom-fb">Continue With Facebook</button>
                    </div>
                </div>
            )}
        </Formik>
        </div>
    );
};

export default SignInForm;