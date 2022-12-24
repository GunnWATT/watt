import {useAuth} from 'reactfire';
import {signInWithRedirect, getRedirectResult, GoogleAuthProvider} from 'firebase/auth';
import {FiLogIn} from 'react-icons/all';


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
        <button className="mt-auto flex items-center gap-4 p-2 w-full rounded overflow-hidden hover:bg-background focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[0xFF7DADD9]" onClick={googleSignIn}>
            <FiLogIn className="flex-none h-6 w-8" />
            {!props.mobile && <span>Sign In</span>}
        </button>
    )
}
