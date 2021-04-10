import React from 'react';
import {Container} from 'reactstrap';

// Icons
import logo from '../../assets/watt.png';
import {
    Home,
    CheckSquare,
    Users,
    Settings,
    Tool
} from 'react-feather';

// Components
import SidebarItem from './SidebarItem';


const BottomNav = () => {
    return (
        <footer className="bottom-nav">
            <Container className="nav-container">
                {/* Nav */}
                <SidebarItem name="Clubs" to="/clubs" icon={<Users/>}/>
                <SidebarItem name="Classes" to="/classes" icon={<CheckSquare/>}/>
                <SidebarItem name="Home" to="/" icon={<Home/>} exact/>
                <SidebarItem name="Utilities" to="/utilities" icon={<Tool/>}/>
                <SidebarItem name="Settings" to="/settings" icon={<Settings/>}/>
            </Container>
        </footer>
    );
}

export default BottomNav;