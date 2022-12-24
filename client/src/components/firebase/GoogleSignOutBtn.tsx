import {useAuth} from 'reactfire';
import {GoogleAuthBtnProps} from './GoogleSignInBtn';
import {FiLogOut} from 'react-icons/all';


export default function GoogleSignOutBtn(props: GoogleAuthBtnProps) {
    const auth = useAuth();

    return (
        <button className="mt-auto flex items-center gap-4 p-2 w-full rounded overflow-hidden hover:bg-background focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[0xFF7DADD9]" onClick={() => auth.signOut()}>
            <FiLogOut className="flex-none h-6 w-8" />
            {!props.mobile && <span>Sign Out</span>}
        </button>
    )
}
