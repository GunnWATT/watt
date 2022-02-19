import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Badge} from 'reactstrap';

// Authentication
import {useSigninCheck} from 'reactfire';

// Components
import SidebarItem from './SidebarItem';
import GoogleSignInBtn from '../firebase/GoogleSignInBtn';
import GoogleSignOutBtn from '../firebase/GoogleSignOutBtn';

// Icons
import {Home, CheckSquare, Users, Settings, Tool, ChevronRight, ChevronLeft} from 'react-feather';


type SidebarProps = {forceCollapsed?: boolean};
export default function Sidebar(props: SidebarProps) {
    const {forceCollapsed} = props;

    // Authentication
    const {status, data: signInCheckResult} = useSigninCheck();

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
            <div className="sidebar-content">
                {/* Toggler */}
                <span className="toggler" onClick={toggle}>
                    {isOpen ? <ChevronLeft /> : <ChevronRight />}
                </span>

                {/* Heading */}
                <Link href="/">
                    <a className="logo">
                        <img src="/watt.png" className="logo" alt="WATT Logo"/>
                    </a>
                </Link>
                <h1>Web App of the Titans</h1>

                {/* Nav */}
                <SidebarItem to="/" icon={<Home/>}>Home</SidebarItem>
                <SidebarItem to="/classes" icon={<CheckSquare/>}>
                    Classes <Badge color="danger" className="beta">Beta</Badge>
                </SidebarItem>
                <SidebarItem to="/clubs" icon={<Users/>}>Clubs</SidebarItem>
                <SidebarItem to="/utilities" icon={<Tool/>}>Utilities</SidebarItem>
                <SidebarItem to="/settings" icon={<Settings/>}>Settings</SidebarItem>

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
