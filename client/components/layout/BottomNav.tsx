import {Popover} from '@headlessui/react';
import {useAuth, useSigninCheck} from 'reactfire';

// Components
import SidebarItem from './SidebarItem';
import AnimatedPopover from './AnimatedPopover';
import GoogleSignInBtn from '../firebase/GoogleSignInBtn';
import GoogleSignOutBtn from '../firebase/GoogleSignOutBtn';

// Icons
import {Home, CheckSquare, Users, Settings, Tool, ChevronUp, ChevronDown} from 'react-feather';


export default function BottomNav() {
    const {status, data: signInCheckResult} = useSigninCheck();

    return (
        <footer className="md:hidden z-10 text-lg bg-sidebar dark:bg-sidebar-dark fixed bottom-0 left-0 w-screen">
            <nav className="flex justify-between py-3 px-8 max-w-lg mx-auto">
                {/* Nav */}
                <SidebarItem to="/clubs" icon={Users} />
                <SidebarItem to="/classes" icon={CheckSquare} />
                <SidebarItem to="/" icon={Home} />
                <SidebarItem to="/utilities" icon={Tool} />

                {/* Dropup */}
                <Popover className="item relative flex">
                    {({open}) => (<>
                        <Popover.Button className="p-2">
                            {open ? <ChevronDown /> : <ChevronUp />}
                        </Popover.Button>

                        {/* TODO: this can use a custom transition where it translates up instead of just `AnimatedPopover` */}
                        <AnimatedPopover className="absolute left-1/2 -top-7 -translate-x-1/2 -translate-y-full flex flex-col gap-4 bg-sidebar dark:bg-sidebar-dark shadow-lg rounded-xl px-1 py-3">
                            {/* Sign In / Out */}
                            {signInCheckResult?.signedIn ? (
                                <GoogleSignOutBtn mobile />
                            ) : (
                                <GoogleSignInBtn mobile />
                            )}

                            <SidebarItem to="/settings" icon={Settings} />
                        </AnimatedPopover>
                    </>)}
                </Popover>
            </nav>
        </footer>
    );
}
