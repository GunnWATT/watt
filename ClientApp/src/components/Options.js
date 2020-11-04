import React, {useState} from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

import Header from './layout/Header';
import Appearance from "./options/Appearance";
import Periods from "./options/Periods";
import Localization from "./options/Localization.js";
import About from "./options/About";
import Credits from "./options/Credits";


const Options = (props) => {
    const [activePage, setActivePage] = useState('1');
    const toggle = page => {
        if (activePage !== page) setActivePage(page);
    }

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
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '5'})}
                            onClick={() => {
                                toggle('5');
                            }}
                        >
                            Credits
                        </NavLink>
                    </NavItem>
                </Nav>
            }
        >
            <TabContent activeTab={activePage}>
                <TabPane tabId="1">
                    <Appearance/>
                </TabPane>
                <TabPane tabId="2">
                    <Periods/>
                </TabPane>
                <TabPane tabId="3">
                    <Localization/>
                </TabPane>
                <TabPane tabId="4">
                    <About/>
                </TabPane>
                <TabPane tabId="5">
                    <Credits/>
                </TabPane>
            </TabContent>
        </Header>
    );
}

export default Options;