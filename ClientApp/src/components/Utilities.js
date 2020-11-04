import React, {useState} from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

import Header from './layout/Header'
import Support from "./utilities/Support";
//import Ad from "./utilities/Ad";
import GraphingCalculator from './utilities/GraphingCalculator';
import Map from "./utilities/Map";
import Calculator from "./utilities/Calculator";


const Utilities = (props) => {
    const [activePage, setActivePage] = useState('1');
    const toggle = page => {
        if (activePage !== page) setActivePage(page);
    }

    return (
        <Header
            heading="Utilities"
            nav={
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '1'})}
                            onClick={() => {
                                toggle('1');
                            }}
                        >
                            GPA Calculator
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '2'})}
                            onClick={() => {
                                toggle('2');
                            }}
                        >
                            Graphing Calculator
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '3'})}
                            onClick={() => {
                                toggle('3');
                            }}
                        >
                            Campus Map
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activePage === '4'})}
                            onClick={() => {
                                toggle('4');
                            }}
                        >
                            Support
                        </NavLink>
                    </NavItem>
                </Nav>
            }
        >
            <TabContent activeTab={activePage}>
                <TabPane tabId="1">
                    {/* <Ad/> */}
                    <Calculator/>
                </TabPane>
                <TabPane tabId="2">
                    <GraphingCalculator/>
                </TabPane>
                <TabPane tabId="3">
                    <Map/>
                </TabPane>
                <TabPane tabId="4">
                    <Support/>
                </TabPane>
            </TabContent>
        </Header>
    );
}

export default Utilities;