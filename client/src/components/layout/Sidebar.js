import React, { useState } from 'react';
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


const Sidebar = (props) => {
    // Collapse
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

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
            {/* <SidebarItem name="Schedule" to="/" icon={<Calendar/>} exact /> */}
            <SidebarItem name="Grades" to="/grades" icon={<CheckSquare/>} />
            <SidebarItem name="Clubs" to="/clubs" icon={<Users/>} />
            <SidebarItem name="Lists" to="/lists" icon={<List/>} />
            <SidebarItem name="Utilities" to="/utilities" icon={<Tool/>} />
            <SidebarItem name="Settings" to="/settings" icon={<Settings/>} />

            {/* Bottom Account Status Button */}
            <span className="bottom">
                {/* <hr/> */}
                <SidebarItem name="Sign Out" to="/super-secret-testing" icon={<LogOut/>} />
            </span>
        </div>
    )
}

export default Sidebar;