import {SignOut} from "../../firebase/Authentication";
import {LogOut} from "react-feather";
import React from "react";

const SignOutBtn = () => (
    <span className={'item'}>
        <button onClick={SignOut}>
            <LogOut/>
            <span>Sign Out</span>
        </button>
    </span>
)

export default SignOutBtn
