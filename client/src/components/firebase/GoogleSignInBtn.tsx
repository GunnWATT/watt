import {useAuth} from 'reactfire';
import {signInWithRedirect, getRedirectResult, GoogleAuthProvider} from 'firebase/auth';
import {LogIn} from 'react-feather';


export default function GoogleSignInBtn() {
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
        <button className="item mt-auto flex items-center gap-4 p-2 w-full rounded overflow-hidden hover:bg-background dark:hover:bg-background-dark" onClick={googleSignIn}>
            <LogIn className="flex-none w-8" />
            <span>Sign In</span>
        </button>
    )
}
