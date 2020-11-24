import React, {useState} from "react";
import classnames from "classnames";

// Components
import List from './lists/List';
import Header from "./layout/Header";
import {Nav, NavItem, NavLink} from "reactstrap";
import ClubComponent from "./lists/ClubComponent";

// Database
import clubs from '../database/clubs.js';


const Clubs = (props) => {
    // Tabs
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    // Search
    const [query, setQuery] = useState('');

    // Filtering based on active tab
    const dataFromTab = () => {
        if (activeTab === '1') return clubs;

        let day;
        switch (activeTab) {
            case '2':
                day = 'Monday';
                break;
            case '3':
                day = 'Tuesday';
                break;
            case '4':
                day = 'Wednesday';
                break;
            case '5':
                day = 'Thursday';
                break;
            case '6':
                day = 'Friday';
                break;
        }

        return Object.entries(clubs).filter(([name, info]) => info.day.includes(day));
    }


    return (
        <Header
            heading="Clubs"
            other={
                <input
                    type="search"
                    placeholder="Search clubs"
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
                            All
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === '2'})}
                            onClick={() => {
                                toggle('2');
                            }}
                        >
                            Monday
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === '3'})}
                            onClick={() => {
                                toggle('3');
                            }}
                        >
                            Tuesday
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === '4'})}
                            onClick={() => {
                                toggle('4');
                            }}
                        >
                            Wednesday
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === '5'})}
                            onClick={() => {
                                toggle('5');
                            }}
                        >
                            Thursday
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === '6'})}
                            onClick={() => {
                                toggle('6');
                            }}
                        >
                            Friday
                        </NavLink>
                    </NavItem>
                </Nav>
            }
        >
            <List
                data={dataFromTab()}
                filter={([key, value]) =>
                    query === '' ||
                    key.toLowerCase().includes(query.toLowerCase())
                    // || value.room.toLowerCase().includes(query.toLowerCase()) // Room exists not in Zoom School
                    || value.day.toLowerCase().includes(query.toLowerCase())
                }
                map={([name, info]) =>
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
                }
            />
        </Header>
    );
}

export default Clubs;
