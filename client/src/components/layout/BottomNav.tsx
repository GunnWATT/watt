import { useState } from 'react';
import {Container} from 'reactstrap';

// Authentication
import {useAuth, useSigninCheck} from 'reactfire';

// Components
import SidebarItem from './SidebarItem';
import GoogleSignInBtn from "../firebase/GoogleSignInBtn"
import GoogleSignOutBtn from '../firebase/GoogleSignOutBtn';

// Icons
// import logo from '../../assets/watt.png';
import {Home, CheckSquare, Users, Settings, Tool, ChevronUp, ChevronDown} from 'react-feather';


export default function BottomNav() {
    const [showDropUp, setDropUp] = useState<boolean>(false);
    const {status, data: signInCheckResult} = useSigninCheck();

    return (
        <footer className="bottom-nav">
            <Container className="nav-container">
                {/* Nav */}
                <SidebarItem name="Clubs" to="/clubs" icon={<Users/>}/>
                <SidebarItem name="Classes" to="/classes" icon={<CheckSquare/>}/>
                <SidebarItem name="Home" to="/" icon={<Home/>}/>
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
                        {signInCheckResult?.signedIn
                            ? <GoogleSignOutBtn />
                            : <GoogleSignInBtn />}
                    </div>
                </div>

                {/* <SidebarItem name="Settings" to="/settings" icon={showDropUp ? <ChevronDown /> : <ChevronUp/>}/> */}
            </Container>
        </footer>
    );
}
