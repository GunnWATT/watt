// React, reactstrap
import React, {useState} from 'react';
import classnames from 'classnames';
import {Nav, NavItem, NavLink} from 'reactstrap';

// Components
import Header from './layout/Header';
import List from "./lists/List";
import WIP from "./misc/WIP";
import StaffComponent from "./lists/StaffComponent";

// Database
import staff from '../database/staff.js';


const Lists = (props) => {
    // Tabs
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    const tabToName = tab => ['Courses', 'Staff'][tab - 1];

    // Search
    const [query, setQuery] = useState('');

    return (
        <Header
            heading={tabToName(activeTab)}
            other={
                <input
                    type="search"
                    placeholder={`Search ${tabToName(activeTab).toLowerCase()}`}
                    onChange={e => setQuery(e.target.value)}
                />
            }
            nav={
                <Nav className="nav-fill" tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === '1'})}
                            onClick={() => {
                                toggle('1');
                            }}
                        >
                            Courses
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === '2'})}
                            onClick={() => {
                                toggle('2');
                            }}
                        >
                            Staff
                        </NavLink>
                    </NavItem>
                </Nav>
            }
        >
            {
                activeTab === '1'
                    ? <WIP />
                    : <List
                        data={staff}
                        filter={([id, staff]) =>
                            query === '' ||
                            staff.name.toLowerCase().includes(query.toLowerCase())
                            || staff.title.toLowerCase().includes(query.toLowerCase())
                            || staff.email.toLowerCase().includes(query.toLowerCase())
                        }
                        map={([id, staff]) =>
                            <StaffComponent
                                key={id}
                                name={staff.name}
                                title={staff.title}
                                department={staff.department}
                                phone={staff.phone}
                                email={staff.email}
                                periods={staff.periods}
                            />
                        }
                        sort={([idA, staffA], [idB, staffB]) => staffA.name.localeCompare(staffB.name)}
                    />
            }
        </Header>
    );
}

export default Lists;