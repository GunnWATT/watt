import React, {useState} from "react";
import classnames from "classnames";

// Components
import List from '../components/lists/List';
import Header from "../components/layout/Header";
import {Nav, NavItem, NavLink} from "reactstrap";
import ClubComponent from "../components/lists/ClubComponent";

// Data
import clubs from '../data/clubs.js';


const Clubs = (props) => {
    // Dynamically setting default tab
    let date = (Number(props.date.format('d')) + 1).toString(); // :weary:
    if (date > 6) date = '1';

    // Tabs
    const [activeTab, setActiveTab] = useState(date);
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
                filter={([id, club]) =>
                    query === '' ||
                    club.name.toLowerCase().includes(query.toLowerCase())
                    // || club.room.toLowerCase().includes(query.toLowerCase()) // Room exists not in Zoom School
                    || club.day.toLowerCase().includes(query.toLowerCase())
                }
                map={([id, club]) =>
                    <ClubComponent
                        key={id}
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
                }
                sort={([idA, clubA], [idB, clubB]) => clubA.name.localeCompare(clubB.name)}
            />
        </Header>
    );
}

export default Clubs;
