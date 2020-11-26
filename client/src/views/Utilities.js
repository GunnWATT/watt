import React, {useState} from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

// Components
import Header from '../components/layout/Header'
import Support from "../components/utilities/Support";
//import Ad from "./utilities/Ad";
import GraphingCalculator from '../components/utilities/GraphingCalculator';
import Map from "../components/utilities/Map";
import Calculator from "../components/utilities/Calculator";



const Utilities = (props) => {
    const [activePage, setActivePage] = useState('1');
    const toggle = page => {
        if (activePage !== page) setActivePage(page);
    }

    const contentFromTabID = (id) => [<Calculator/>, <GraphingCalculator/>, <Map/>, <Support/>][id - 1];

    return (
        <Header
            heading="Utilities"
            nav={
                <Nav fill tabs>
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
            {contentFromTabID(Number(activePage))}
        </Header>
    );
}

export default Utilities;