import React, { useState } from 'react';
import classnames from 'classnames';
import {Link} from "react-router-dom";

// Fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faCheckSquare, faCalendarAlt, faList, faCog, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';


const Sidebar = (props) => {
    // Active tab
    const [activeTab, setActiveTab] = useState('3')

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
                <FontAwesomeIcon icon={faBars} />
            </span>

            {/* Heading */}
            <h1>Gunn WATT</h1>
            <hr/>

            {/* Nav */}
            <span className="item">
                <Link to="/utilities">
                    <FontAwesomeIcon icon={faWrench} />
                    <span>Utilities</span>
                </Link>
            </span>
            <span className="item">
                <Link to="/grades">
                    <FontAwesomeIcon icon={faCheckSquare} />
                    <span>Grades</span>
                </Link>
            </span>
            <span className="item">
                <Link to="/">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>Schedule</span>
                </Link>
            </span>
            <span className="item">
                <Link to="/lists">
                    <FontAwesomeIcon icon={faList} className="icon"/>
                    <span>Lists</span>
                </Link>
            </span>
            <span className="item">
                <Link to="/options">
                    <FontAwesomeIcon icon={faCog} />
                    <span>Options</span>
                </Link>
            </span>

            {/* Bottom Account Status Button */}
            <span className="bottom">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Sign Out</span>
            </span>
        </div>
    )
}

export default Sidebar;