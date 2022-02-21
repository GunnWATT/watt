import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

// Authentication
import {useSigninCheck} from 'reactfire';

// Components
import SidebarItem from './SidebarItem';
import GoogleSignInBtn from '../firebase/GoogleSignInBtn';
import GoogleSignOutBtn from '../firebase/GoogleSignOutBtn';
import Badge from './Badge';

// Icons
import logo from '../../assets/watt.png';
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
        <div className={`sidebar z-10 flex-none relative ${!isOpen ? 'collapsed' : ''}`}>
            {/* The outer <div> only exists to occupy space to squish #content; the inner <div> has position: fixed; */}
            <div className="sidebar-content fixed top-0 bottom-0 flex flex-col overflow-hidden">
                {/* Toggler */}
                <span className="ml-auto mb-4 p-2 cursor-pointer" onClick={toggle}>
                    {isOpen ? <ChevronLeft/> : <ChevronRight/>}
                </span>

                {/* Heading */}
                <Link to="/" className="w-16 h-16 self-center">
                    <img src={logo} alt="WATT Logo"/>
                </Link>
                <h1 className="text-sm mt-4 mx-auto mb-8">Web App of the Titans</h1>

                {/* Nav */}
                <SidebarItem to="/" icon={<Home/>}>Home</SidebarItem>
                <SidebarItem to="/classes" icon={<CheckSquare/>}>
                    Classes <Badge>Beta</Badge>
                </SidebarItem>
                <SidebarItem to="/clubs" icon={<Users/>}>Clubs</SidebarItem>
                <SidebarItem to="/utilities" icon={<Tool/>}>Utilities</SidebarItem>
                <SidebarItem to="/settings" icon={<Settings/>}>Settings</SidebarItem>

                {/* Bottom Account Status Button */}
                <span className="bottom mt-auto">
                    {signInCheckResult?.signedIn
                        ? <GoogleSignOutBtn/>
                        : <GoogleSignInBtn/>}
                </span>
            </div>
        </div>
    )
}
