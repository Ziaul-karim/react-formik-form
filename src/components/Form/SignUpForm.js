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
//firebase.initializeApp(firebaseConfig)


const SignUpForm = () => {
    const [user, setUser] = useState({
        isSignedIn: false,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        success: false
    })

    const provider = new firebase.auth.GoogleAuthProvider();

    const googleSignIn = () =>{
        firebase.auth().signInWithPopup(provider)
        .then( res => {
            const {displayName, email, photoURL} = res.user;
            const signedInUser = {
                isSignedIn: true,
                firstName: displayName,
                email: email
            }
            setUser(signedInUser)
        })
        .catch( error =>{
            console.log(error.message)
        })
    }

    const validate = Yup.object({
        firstName: Yup.string()
        .required('First Name is Required'),
        lastName: Yup.string()
        .required('Last Name is Required'),
        email: Yup.string()
        .email('Email is Invalid')
        .required('Email is Required'),
        password: Yup.string()
        .min(6, 'Password must be at least six characters')
        .required('Password is Required'),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password must match')
        .required('Confirm password is Required'),
    })

    const updateName = name =>{
        const user = firebase.auth().currentUser;

        user.updateProfile({
        displayName: name
        }).then(function() {
            console.log("Name Updated Successfully")
        }).catch(function(error) {
        // An error happened.
        });
    }

    return (
        <div>
            <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            }}
            validationSchema={validate}
            onSubmit={value =>{
                setUser(value)
                if(value.email && value.password){
                    firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
                    .then(res => {
                        const newUserInfo = {...user}
                        newUserInfo.success = true;
                        newUserInfo.error = "User created Successfully";                        
                        setUser(newUserInfo);
                        updateName(value.firstName);
                    })
                    .catch((error) => {
                        const newUserInfo = {...user}
                        newUserInfo.success = false;
                        newUserInfo.error = error.message;
                        console.log(error.code)
                        setUser(newUserInfo)
                    });
                }
            }}
        >
            
            {formik =>(
                <div className="form-body">
                    <div className="form-body-style mt-5 p-4 pl-5">
                        {user.success ? <p style={{color:'green'}}>{user.error}</p> : <p style={{color:'red'}}>{user.error}</p>}
                        <h1 className="my-4 font-weight-bold-display-4">Create an Account</h1>
                        <Form onSubmit={formik.handleSubmit} className="form-body-main mr-4">
                            <TextField name="firstName" type="text" placeholder="First Name"></TextField>
                            <TextField name="lastName" type="text" placeholder="Last Name"></TextField>
                            <TextField name="email" type="email" placeholder="Email"></TextField>
                            <TextField name="password" type="password" placeholder="Password"></TextField>
                            <TextField name="confirmPassword" type="password" placeholder="Confirm Password"></TextField>
                            {/* {
                            newUser ? <button type="submit"  className="btn btn-warning mt-5 w-100">Create an Account</button> 
                                    : <button type="submit" className="btn btn-warning mt-5 w-100">Login</button>
                            } */}
                            
                            <button type="submit"  className="btn btn-warning mt-5 w-100">Create an Account</button>

                            {/* <p className="text-center mt-4">{newUser ? "Already Have an Account?" : "Don't have Account?" } 
                                <span 
                                    onClick={()=> setNewUser(!newUser)} 
                                    style={{color:'orange', cursor: 'pointer', fontWeight:'bold'}}>{newUser ? " Login" : " Sign Up"}
                                </span>
                            </p> */}

                            <p className="text-center mt-4">"Already Have an Account?" 
                                <Link to="/login" 
                                    style={{color:'orange', cursor: 'pointer', fontWeight:'bold'}}>Login
                                </Link>
                            </p>
                        </Form>
                    </div>
                    <div className="or mt-5">
                        <div className="lines mb-5">
                            <p>Or</p>
                        </div>
                        <button className="btn btn-warning w-100 button-custom button-custom-fb">Continue With Facebook</button>
                        <button onClick={googleSignIn} className="btn btn-warning w-100 button-custom button-custom-g mt-3">Continue With Google</button>
                    </div>
                </div>
            )}
        </Formik>
        </div>
    );
};

export default SignUpForm;