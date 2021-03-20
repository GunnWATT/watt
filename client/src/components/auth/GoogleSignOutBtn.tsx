import React from "react";
import {SignOut} from "../../firebase/Authentication";

import {LogOut} from "react-feather";


const GoogleSignOutBtn = () => {
    return (
        <span className={'item'}>
            <button onClick={SignOut}>
                <LogOut/>
                <span>Sign Out</span>
            </button>
        </span>
    )
}

export default GoogleSignOutBtn
