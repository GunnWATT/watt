import React from 'react';
import {useAuth} from 'reactfire';

import {LogOut} from 'react-feather';


const GoogleSignOutBtn = () => {
    const auth = useAuth();

    return (
        <span className="item">
            <button onClick={() => auth.signOut()}>
                <LogOut/>
                <span>Sign Out</span>
            </button>
        </span>
    )
}

export default GoogleSignOutBtn
