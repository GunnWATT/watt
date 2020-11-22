// React, reactstrap
import React, {useState} from 'react';
import classnames from 'classnames';
import {Nav, NavItem, NavLink} from 'reactstrap';

// Components
import Header from './layout/Header';
import StaffComponent from "./lists/StaffComponent";
import ClubComponent from "./lists/ClubComponent";

// Database
import clubs from '../database/clubs.js';
import staff from '../database/staff.js';


const Lists = (props) => {
    // Tabs
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    const tabToName = tab => ['Clubs', 'Staff'][tab - 1];

    // Search
    const [query, setQuery] = useState('');


    // Renders the HTML of the actual list
    const renderData = (data) => {

        // Filters data so that only entries matching the search are rendered, and then renders content
        // Could potentially consisify?
        let filtered = Object.entries(data).sort(); // Creates nested array where [0] is the name and [1] is the object data
        let content;

        switch (activeTab) {
            case '1':
                filtered = filtered.filter(([key, value]) =>
                    query === '' ||
                    key.toLowerCase().includes(query.toLowerCase())
                    // || value.room.toLowerCase().includes(query.toLowerCase()) // Room exists not in Zoom School
                    || value.day.toLowerCase().includes(query.toLowerCase())
                )
                content = filtered.map(([name, info]) =>
                    <ClubComponent
                        key={name}
                        name={name}
                        room={info.room}
                        day={info.day}
                        time={info.time}
                        desc={info.desc}
                        president={info.prez}
                        teacher={info.advisor}
                        email={info.email}
                        new={info.new}
                    />
                )
                break;

            case '2':
                filtered = filtered.filter(([key, value]) =>
                    query === '' ||
                    key.toLowerCase().includes(query.toLowerCase())
                    || value.title.toLowerCase().includes(query.toLowerCase())
                    || value.email.toLowerCase().includes(query.toLowerCase())
                )
                content = filtered.map(([name, info]) =>
                    <StaffComponent
                        key={name}
                        name={name}
                        title={info.title}
                        department={info.department}
                        phone={info.phone}
                        email={info.email}
                        periods={info.periods}
                    />
                )
                break;
        }

        return (
            <ul className="material-list">
                {content}
            </ul>
        );
    }


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
                            Clubs
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
            {renderData(activeTab === '1' ? clubs : staff)}
        </Header>
    );
}

export default Lists;