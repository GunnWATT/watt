import {useAuth} from 'reactfire';
import {LogOut} from 'react-feather';


export default function GoogleSignOutBtn() {
    const auth = useAuth();

    return (
        <button className="item mt-auto flex items-center gap-4 p-2 w-full rounded overflow-hidden hover:bg-background dark:hover:bg-background-dark" onClick={() => auth.signOut()}>
            <LogOut className="flex-none w-8" />
            <span>Sign Out</span>
        </button>
    )
}
