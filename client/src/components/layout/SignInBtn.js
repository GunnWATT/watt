import {GoogleSignIn} from "../../firebase/Authentication";
import {LogIn} from "react-feather";
import React from "react";

const SignInBtn = () => (
    <span className={'item'}>
        <button onClick={GoogleSignIn}>
            <LogIn/>
            <span>Sign In</span>
        </button>
    </span>
)

export default SignInBtn
