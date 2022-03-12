import {useAuth} from 'reactfire';
import {signInWithRedirect, getRedirectResult, GoogleAuthProvider} from 'firebase/auth';
import {LogIn} from 'react-feather';


// TODO: better way of doing this than `props.mobile`? `useScreenType` also seems a bit hacky
export type GoogleAuthBtnProps = {mobile?: boolean};
export default function GoogleSignInBtn(props: GoogleAuthBtnProps) {
    const auth = useAuth();

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({hd: 'pausd.us'});

        await signInWithRedirect(auth, provider);
    }

    return (
        <button className="item mt-auto flex items-center gap-4 p-2 w-full rounded overflow-hidden hover:bg-background dark:hover:bg-background-dark" onClick={googleSignIn}>
            <LogIn className="flex-none w-8" />
            {!props.mobile && <span>Sign In</span>}
        </button>
    )
}
