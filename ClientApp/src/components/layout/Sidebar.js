import React, { useState } from 'react';

// Icons
import logo from '../../assets/watt.svg';
import { FiCheckSquare, FiCalendar, FiList, FiSettings, FiLogIn, FiLogOut, FiChevronsRight, FiChevronsLeft } from 'react-icons/fi';
import { VscSymbolProperty } from 'react-icons/vsc';

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
                        ? <FiChevronsLeft />
                        : <FiChevronsRight />
                }
            </span>

            {/* Heading */}
            <img src={logo} alt="WATT Logo" className="logo" />
            <h1>Web App of the Titans</h1>
            {/* <hr/> */}

            {/* Nav */}
            <SidebarItem name="Schedule" to="/" icon={<FiCalendar/>} exact />
            <SidebarItem name="Grades" to="/grades" icon={<FiCheckSquare/>} />
            <SidebarItem name="Lists" to="/lists" icon={<FiList/>} />
            <SidebarItem name="Utilities" to="/utilities" icon={<VscSymbolProperty/>} />
            <SidebarItem name="Options" to="/options" icon={<FiSettings/>} />

            {/* Bottom Account Status Button */}
            <span className="bottom">
                {/* <hr/> */}
                <SidebarItem name="Sign Out" to="/super-secret-testing" icon={<FiLogOut/>} />
            </span>
        </div>
    )
}

export default Sidebar;