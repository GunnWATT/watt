import React from "react";
import {GoogleSignIn} from "../../firebase/Authentication";

import {LogIn} from "react-feather";


const GoogleSignInBtn = () => (
    <span className={'item'}>
        <button onClick={GoogleSignIn}>
            <LogIn/>
            <span>Sign In</span>
        </button>
    </span>
)

export default GoogleSignInBtn
