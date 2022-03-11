import {Popover} from '@headlessui/react';
import {useAuth, useSigninCheck} from 'reactfire';

// Components
import SidebarItem from './SidebarItem';
import GoogleSignInBtn from "../firebase/GoogleSignInBtn"
import GoogleSignOutBtn from '../firebase/GoogleSignOutBtn';

// Icons
// import logo from '../../assets/watt.png';
import {Home, CheckSquare, Users, Settings, Tool, ChevronUp, ChevronDown} from 'react-feather';


export default function BottomNav() {
    const {status, data: signInCheckResult} = useSigninCheck();

    return (
        <footer className="bottom-nav z-10 text-lg bg-sidebar dark:bg-sidebar-dark fixed bottom-0 left-0 w-screen">
            <nav className="flex justify-between py-3 px-8 max-w-lg mx-auto">
                {/* Nav */}
                <SidebarItem to="/clubs" icon={Users} />
                <SidebarItem to="/classes" icon={CheckSquare} />
                <SidebarItem to="/" icon={Home} />
                <SidebarItem to="/utilities" icon={Tool} />

                {/* Dropup */}
                <Popover className="item dropup-wrapper relative flex">
                    {({open}) => (<>
                        <Popover.Button className="p-2">
                            {open ? <ChevronDown /> : <ChevronUp />}
                        </Popover.Button>

                        {/* TODO: add transitions? */}
                        <Popover.Panel className="bottom-nav-dropup absolute flex flex-col gap-4 bg-sidebar dark:bg-sidebar-dark shadow-lg rounded-xl px-1 py-3">
                            {/* Sign In / Out */}
                            {signInCheckResult?.signedIn ? (
                                <GoogleSignOutBtn mobile />
                            ) : (
                                <GoogleSignInBtn mobile />
                            )}

                            <SidebarItem to="/settings" icon={Settings} />
                        </Popover.Panel>
                    </>)}
                </Popover>
            </nav>
        </footer>
    );
}
