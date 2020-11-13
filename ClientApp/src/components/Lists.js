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
        console.log(filtered);
        let content;
        switch (activeTab) {
            case '1':
                filtered = filtered.filter(data =>
                    query === '' ||
                    data[0].toLowerCase().includes(query.toLowerCase())
                    // || data[1].room.toLowerCase().includes(query.toLowerCase()) // Room exists not in Zoom School
                    || data[1].day.toLowerCase().includes(query.toLowerCase())
                )
                content = filtered.map(club =>
                    <ClubComponent
                        key={club[0]}
                        name={club[0]}
                        room={club[1].room}
                        day={club[1].day}
                        time={club[1].time}
                        desc={club[1].desc}
                        president={club[1].prez}
                        teacher={club[1].advisor}
                        email={club[1].email}
                        new={club[1].new}
                    />
                )
                break;

            case '2':
                filtered = filtered.filter(data =>
                    query === '' ||
                    data[0].toLowerCase().includes(query.toLowerCase())
                    || data[1].title.toLowerCase().includes(query.toLowerCase())
                    || data[1].email.toLowerCase().includes(query.toLowerCase())
                )
                content = filtered.map(staff =>
                    <StaffComponent
                        key={staff[0]}
                        name={staff[0]}
                        title={staff[1].title}
                        department={staff[1].department}
                        phone={staff[1].phone}
                        email={staff[1].email}
                        periods={staff[1].periods}
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