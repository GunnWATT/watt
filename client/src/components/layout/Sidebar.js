import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

// Icons
import logo from '../../assets/watt.svg';
import {
    Home,
    CheckSquare,
    Calendar,
    Users,
    List,
    Settings,
    Tool,
    LogIn,
    LogOut,
    ChevronsRight,
    ChevronsLeft
} from 'react-feather';

// Components
import SidebarItem from "./SidebarItem";

// Authentication
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "../../firebase/Firebase"
import {GoogleSignIn, SignOut, FirestoreInit} from "../../firebase/Authentication";



const Sidebar = (props) => {
    // Authentication
    const auth = firebase.auth
    const [user] = useAuthState(auth)
    useEffect(() => {
        auth.getRedirectResult().then(r => FirestoreInit(r))
    }, [])

    // Collapse
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

    // Sign In/Out Buttons
    const SignInButton = () => (
        <span className={'item'}>
            <button onClick={GoogleSignIn}>
                <LogIn />
                <span>Sign In</span>
            </button>
        </span>
    )

    const SignOutButton = () => (
        <span className={'item'}>
            <button onClick={SignOut}>
                <LogOut />
                <span>Sign Out</span>
            </button>
        </span>
    )

    return (
        <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
            {/* Toggler */}
            <span
                className="toggler"
                onClick={toggle}
            >
                {
                    isOpen
                        ? <ChevronsLeft />
                        : <ChevronsRight />
                }
            </span>

            {/* Heading */}
            <Link to="/" className="logo">
                <img src={logo} alt="WATT Logo" />
            </Link>
            <h1>Web App of the Titans</h1>
            {/* <hr/> */}

            {/* Nav */}
            <SidebarItem name="Home" to="/" icon={<Home/>} exact />
            <SidebarItem name="Classes" to="/classes" icon={<CheckSquare/>} />
            <SidebarItem name="Clubs" to="/clubs" icon={<Users/>} />
            <SidebarItem name="Utilities" to="/utilities" icon={<Tool/>} />
            <SidebarItem name="Settings" to="/settings" icon={<Settings/>} />

            {/* Bottom Account Status Button */}
            <span className="bottom">
                {
                    user ? (
                        <SignOutButton />
                    ) : (
                        <SignInButton />
                    )
                }
            </span>
        </div>
    )
}

export default Sidebar;
