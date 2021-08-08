import React, { useState } from 'react';
import {Container} from 'reactstrap';

// Icons
import logo from '../../assets/watt.png';
import {
    Home,
    CheckSquare,
    Users,
    Settings,
    Tool,
    ChevronUp,
    ChevronDown
} from 'react-feather';

// Components
import SidebarItem from './SidebarItem';
import GoogleSignInBtn from "../auth/GoogleSignInBtn"
import GoogleSignOutBtn from '../auth/GoogleSignOutBtn';

import firebase from '../../firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';


const BottomNav = () => {

    const [showDropUp, setDropUp] = useState<boolean>(false);

    const auth = firebase.auth;
    const [user] = useAuthState(auth);

    return (
        <footer className="bottom-nav">
            <Container className="nav-container">
                {/* Nav */}
                <SidebarItem name="Clubs" to="/clubs" icon={<Users/>}/>
                <SidebarItem name="Classes" to="/classes" icon={<CheckSquare/>}/>
                <SidebarItem name="Home" to="/" icon={<Home/>} exact/>
                <SidebarItem name="Utilities" to="/utilities" icon={<Tool/>}/>

                {/* Dropup */}
                <div className="item dropup-wrapper">
                    <a onClick={() => setDropUp(!showDropUp)}>
                        {showDropUp ? <ChevronDown /> : <ChevronUp />}
                    </a>

                    <div className="bottom-nav-dropup" hidden={!showDropUp}>

                        {/* Settings */}
                        <SidebarItem name="Settings" to="/settings" icon={<Settings />} />
                        
                        {/* Sign In / Out */}
                        {
                            user ?
                                <GoogleSignOutBtn /> :
                                <GoogleSignInBtn />
                        }
                    </div>
                </div>

                {/* <SidebarItem name="Settings" to="/settings" icon={showDropUp ? <ChevronDown /> : <ChevronUp/>}/> */}
            </Container>
        </footer>
    );
}

export default BottomNav;