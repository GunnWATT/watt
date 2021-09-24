import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

// Authentication
import {useAuth, useFirestore, useSigninCheck} from 'reactfire';
import {getRedirectResult} from 'firebase/auth';
import {firestoreInit} from '../../firebase/auth';

// Components
import SidebarItem from './SidebarItem';
import GoogleSignInBtn from '../firebase/GoogleSignInBtn';
import GoogleSignOutBtn from '../firebase/GoogleSignOutBtn';

// Icons
import logo from '../../assets/watt.png';
import {Home, CheckSquare, Users, Settings, Tool, ChevronRight, ChevronLeft} from 'react-feather';


type SidebarProps = {forceCollapsed?: boolean};
export default function Sidebar(props: SidebarProps) {
    const {forceCollapsed} = props;

    // Authentication
    const auth = useAuth();
    const firestore = useFirestore();
    const {status, data: signInCheckResult} = useSigninCheck();

    useEffect(() => {
        getRedirectResult(auth).then(r => r && firestoreInit(firestore, r))
    }, []);

    // Collapse
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

    // Unideal but oh well
    useEffect(() => {
        setIsOpen(!forceCollapsed);
    }, [forceCollapsed])


    return (
        <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
            {/* The outer <div> only exists to occupy space to squish #content; the inner <div> has position: fixed; */}
            <div className='sidebar-content'>
                {/* Toggler */}
                <span
                    className="toggler"
                    onClick={toggle}
                >
                    {isOpen
                        ? <ChevronLeft/>
                        : <ChevronRight/>}
                </span>

                {/* Heading */}
                <Link to="/" className="logo">
                    <img src={logo} className="logo" alt="WATT Logo"/>
                </Link>
                <h1>Web App of the Titans</h1>

                {/* Nav */}
                <SidebarItem name="Home" to="/" icon={<Home/>} exact/>
                <SidebarItem name="Classes" to="/classes" icon={<CheckSquare/>}/>
                <SidebarItem name="Clubs" to="/clubs" icon={<Users/>}/>
                <SidebarItem name="Utilities" to="/utilities" icon={<Tool/>}/>
                <SidebarItem name="Settings" to="/settings" icon={<Settings/>}/>

                {/* Bottom Account Status Button */}
                <span className="bottom">
                    {signInCheckResult?.signedIn
                        ? <GoogleSignOutBtn/>
                        : <GoogleSignInBtn/>}
                </span>
            </div>
        </div>
    )
}
