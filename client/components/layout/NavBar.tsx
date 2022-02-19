import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Badge, Container} from 'reactstrap';

// Hooks
import {useSigninCheck} from 'reactfire';
import {useScreenType} from '../../hooks/useScreenType';

// Components
import NavBarItem from './NavBarItem';
import GoogleSignInBtn from '../firebase/GoogleSignInBtn';
import GoogleSignOutBtn from '../firebase/GoogleSignOutBtn';

// Icons
import {
    Home, CheckSquare, Users, Settings, Tool, ChevronRight,
    ChevronLeft, ChevronDown, ChevronUp
} from 'react-feather';


// TODO: rewrite this semi-hacky `forceCollapsed` behavior
type NavBarProps = {forceCollapsed?: boolean};
export default function NavBar(props: NavBarProps) {
    const {forceCollapsed} = props;

    const screenType = useScreenType();
    const {status, data: signInCheckResult} = useSigninCheck();

    // Collapse
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

    // Unideal but oh well
    useEffect(() => {
        setIsOpen(!forceCollapsed);
    }, [forceCollapsed])


    // On phones, render a bottom nav
    if (screenType === 'phone') return (
        <footer className="bottom-nav">
            <Container className="nav-container">
                {/* Nav */}
                <NavBarItem to="/clubs" icon={<Users/>} />
                <NavBarItem to="/classes" icon={<CheckSquare/>} />
                <NavBarItem to="/" icon={<Home/>} />
                <NavBarItem to="/utilities" icon={<Tool/>} />

                {/* Dropup */}
                <div className="item dropup-wrapper">
                    <a onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <ChevronDown /> : <ChevronUp />}
                    </a>

                    <div className="bottom-nav-dropup" hidden={!isOpen}>
                        <NavBarItem to="/settings" icon={<Settings />} />

                        {/* Sign In / Out */}
                        {signInCheckResult?.signedIn
                            ? <GoogleSignOutBtn />
                            : <GoogleSignInBtn />}
                    </div>
                </div>
            </Container>
        </footer>
    );

    // Otherwise, render a sidebar
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
                <NavBarItem to="/" icon={<Home/>}>Home</NavBarItem>
                <NavBarItem to="/classes" icon={<CheckSquare/>}>
                    Classes <Badge color="danger" className="beta">Beta</Badge>
                </NavBarItem>
                <NavBarItem to="/clubs" icon={<Users/>}>Clubs</NavBarItem>
                <NavBarItem to="/utilities" icon={<Tool/>}>Utilities</NavBarItem>
                <NavBarItem to="/settings" icon={<Settings/>}>Settings</NavBarItem>

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
