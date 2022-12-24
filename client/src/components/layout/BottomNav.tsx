import {Popover} from '@headlessui/react';
import {useAuth, useSigninCheck} from 'reactfire';

// Components
import SidebarItem from './SidebarItem';
import AnimatedPopover from './AnimatedPopover';
import GoogleSignInBtn from '../firebase/GoogleSignInBtn';
import GoogleSignOutBtn from '../firebase/GoogleSignOutBtn';

// Icons
import {FiHome, FiCheckSquare, FiUsers, FiSettings, FiTool, FiChevronUp, FiChevronDown} from 'react-icons/all';


export default function BottomNav() {
    const {status, data: signInCheckResult} = useSigninCheck();

    return (
        <footer className="z-10 text-lg bg-sidebar dark:bg-sidebar-dark fixed bottom-0 left-0 w-screen">
            <nav className="flex justify-between py-3 px-8 max-w-lg mx-auto">
                {/* Nav */}
                <SidebarItem to="/clubs" icon={FiUsers} />
                <SidebarItem to="/classes" icon={FiCheckSquare} />
                <SidebarItem to="/" icon={FiHome} />
                <SidebarItem to="/utilities" icon={FiTool} />

                {/* Dropup */}
                <Popover className="relative flex">
                    {({open}) => (<>
                        <Popover.Button className="p-2 rounded focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[0xFF7DADD9]">
                            {open ? <FiChevronDown className="w-6 h-6" /> : <FiChevronUp className="w-6 h-6" />}
                        </Popover.Button>

                        {/* TODO: this can use a custom transition where it translates up instead of just `AnimatedPopover` */}
                        <AnimatedPopover className="absolute left-1/2 -top-7 -translate-x-1/2 -translate-y-full flex flex-col gap-4 bg-sidebar dark:bg-sidebar-dark shadow-lg rounded-xl px-1 py-3">
                            {/* Sign In / Out */}
                            {signInCheckResult?.signedIn ? (
                                <GoogleSignOutBtn mobile />
                            ) : (
                                <GoogleSignInBtn mobile />
                            )}

                            <SidebarItem to="/settings" icon={FiSettings} />
                        </AnimatedPopover>
                    </>)}
                </Popover>
            </nav>
        </footer>
    );
}
