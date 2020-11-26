import React, {useState} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

// Components
import Header from '../components/layout/Header';
import Appearance from "../components/options/Appearance";
import Periods from "../components/options/Periods";
import Localization from "../components/options/Localization.js";
import About from "../components/options/About";


const Settings = (props) => {
    const [activePage, setActivePage] = useState('1');
    const toggle = page => {
        if (activePage !== page) setActivePage(page);
    }

    const contentFromTabID = (id) => [<Appearance/>, <Periods/>, <Localization/>, <About/>][id - 1];

    return (
        <Header
            heading="Settings"
            nav={
                <Nav fill tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '1'})}
                            onClick={() => {
                                toggle('1');
                            }}
                        >
                            Appearance
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '2'})}
                            onClick={() => {
                                toggle('2');
                            }}
                        >
                            Periods
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '3'})}
                            onClick={() => {
                                toggle('3');
                            }}
                        >
                            Localization
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '4'})}
                            onClick={() => {
                                toggle('4');
                            }}
                        >
                            About
                        </NavLink>
                    </NavItem>
                </Nav>
            }
        >
            {contentFromTabID(Number(activePage))}
        </Header>
    );
}

export default Settings;