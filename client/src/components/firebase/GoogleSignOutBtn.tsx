import {useAuth} from 'reactfire';
import {LogOut} from 'react-feather';


export default function GoogleSignOutBtn() {
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
