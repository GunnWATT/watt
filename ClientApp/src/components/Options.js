import React, {useState} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

import Header from './layout/Header';
import Appearance from "./options/Appearance";
import Periods from "./options/Periods";
import Localization from "./options/Localization.js";
import About from "./options/About";


const Options = (props) => {
    const [activePage, setActivePage] = useState('1');
    const toggle = page => {
        if (activePage !== page) setActivePage(page);
    }

    const contentFromTabID = (id) => [<Appearance/>, <Periods/>, <Localization/>, <About/>][id - 1];

    return (
        <Header
            heading="Options"
            nav={
                <Nav tabs>
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

export default Options;