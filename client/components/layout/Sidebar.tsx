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
        <aside className={'z-10 flex-none relative transition-[width] duration-[400ms] ' + (isOpen ? 'w-56' : 'w-20')}>
            {/* The outer <aside> only exists to occupy space to squish #content; the inner <div> has position: fixed; */}
            <div className={'p-4 text-lg bg-sidebar dark:bg-sidebar-dark fixed top-0 bottom-0 flex flex-col transition-[width] duration-[400ms] overflow-hidden whitespace-nowrap ' + (isOpen ? 'w-56' : 'w-20')}>
                {/* Toggler */}
                <span className="ml-auto mb-4 p-2 cursor-pointer" onClick={toggle}>
                    {isOpen ? <ChevronLeft/> : <ChevronRight/>}
                </span>

                {/* Heading */}
                <Link to="/" className="w-16 h-16 self-center">
                    <img src="/watt.png" alt="WATT Logo"/>
                </Link>
                <h1 className={'text-sm mt-4 mx-auto mb-8' + (!isOpen ? ' opacity-0' : '')}>
                    Web App of the Titans
                </h1>

                {/* Nav */}
                <nav className="flex flex-col gap-3 mt-3 h-full">
                    <SidebarItem to="/" icon={Home}>Home</SidebarItem>
                    <SidebarItem to="/classes" icon={CheckSquare}>
                        Classes<Badge>Beta</Badge>
                    </SidebarItem>
                    <SidebarItem to="/clubs" icon={Users}>Clubs</SidebarItem>
                    <SidebarItem to="/utilities" icon={Tool}>Utilities</SidebarItem>
                    <SidebarItem to="/settings" icon={Settings}>Settings</SidebarItem>

                    {/* Bottom Account Status Button */}
                    {signInCheckResult?.signedIn ? (
                        <GoogleSignOutBtn />
                    ) : (
                        <GoogleSignInBtn />
                    )}
                </nav>
            </div>
        </aside>
    )
}
