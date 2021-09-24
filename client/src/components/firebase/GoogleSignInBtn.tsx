import React from 'react';
import {useAuth} from 'reactfire';
import {signInWithRedirect, getRedirectResult, GoogleAuthProvider} from 'firebase/auth';

import {LogIn} from 'react-feather';


const GoogleSignInBtn = () => {
    const auth = useAuth();

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider()
        provider.addScope('profile')
        provider.addScope('email')
        provider.setCustomParameters({
            hd: 'pausd.us'
        });

        await signInWithRedirect(auth, provider);
    }

    return (
        <span className="item">
            <button onClick={googleSignIn}>
                <LogIn/>
                <span>Sign In</span>
            </button>
        </span>
    )
}

export default GoogleSignInBtn
