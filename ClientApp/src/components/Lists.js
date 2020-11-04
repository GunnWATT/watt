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
    const [activeTab, setActiveTab] = useState('2');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    const tabToName = tab => ['Clubs', 'Staff'][tab - 1];

    // Search
    const [query, setQuery] = useState('');


    // Renders the HTML of the actual list
    const renderData = (data) => {

        // Makes the name of the object a field for each object so that it can be obtained via object.name
        // Ideally not needed
        const renderName = (list) => {
            for (let item in list) {
                list[item].name = item;
            }
            return list;
        }

        // Filters data so that only entries matching the search are rendered, and then renders content
        // Could potentially consisify?
        let filtered = Object.values(renderName(data));
        let content;
        switch (activeTab) {
            case '1':
                filtered = filtered.filter(data =>
                    query === '' ||
                    data.name.toLowerCase().includes(query.toLowerCase())
                    // || data.room.toLowerCase().includes(query.toLowerCase()) // Room exists not in Zoom School
                    || data.day.toLowerCase().includes(query.toLowerCase())
                )
                content = filtered.map(club =>
                    <ClubComponent
                        key={club.name}
                        name={club.name}
                        room={club.room}
                        day={club.day}
                        time={club.time}
                        desc={club.desc}
                        president={club.prez}
                        teacher={club.advisor}
                        email={club.email}
                        new={club.new}
                    />
                )
                break;

            case '2':
                filtered = filtered.filter(data =>
                    query === '' ||
                    data.name.toLowerCase().includes(query.toLowerCase())
                    || data.title.toLowerCase().includes(query.toLowerCase())
                    || data.email.toLowerCase().includes(query.toLowerCase())
                )
                content = filtered.map(staff =>
                    <StaffComponent
                        key={staff.name}
                        name={staff.name}
                        title={staff.title}
                        department={staff.department}
                        phone={staff.phone}
                        email={staff.email}
                        periods={staff.periods}
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