import React, {useContext, useState} from 'react';
import {Nav} from 'reactstrap';
import {Moment} from 'moment';
import UserDataContext from '../contexts/UserDataContext';

// Components
import List from '../components/lists/List';
import Header from '../components/layout/Header';
import StateTab from '../components/layout/StateTab';
import ClubComponent from '../components/lists/ClubComponent';

// Data
import clubs from '../data/clubs';


type HomeProps = {date: Moment}
const Clubs = (props: HomeProps) => {
    // Dynamically setting default tab
    let date = (Number(props.date.format('d')) + 1).toString(); // :weary:
    if (date > '6') date = '1';

    // Tabs
    const [activeTab, setActiveTab] = useState(date);
    const toggle = (tab: string) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    // User data for pinned
    const userData = useContext(UserDataContext);

    // Search
    const [query, setQuery] = useState('');

    // Filtering based on active tab
    const dataFromTab = () => {
        if (activeTab === '1') return clubs;

        let day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
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
                    <StateTab value="1" name="All" state={activeTab} setState={toggle} />
                    <StateTab value="2" name="Monday" state={activeTab} setState={toggle} />
                    <StateTab value="3" name="Tuesday" state={activeTab} setState={toggle} />
                    <StateTab value="4" name="Wednesday" state={activeTab} setState={toggle} />
                    <StateTab value="5" name="Thursday" state={activeTab} setState={toggle} />
                    <StateTab value="6" name="Friday" state={activeTab} setState={toggle} />
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
                        id={id}
                        name={club.name}
                        // room={club.room}
                        day={club.day}
                        time={club.time}
                        desc={club.desc}
                        zoom={club.zoom}
                        video={club.video}
                        signup={club.signup}
                        tier={club.tier}
                        prez={club.prez}
                        advisor={club.advisor}
                        email={club.email}
                        new={club.new}
                    />
                }
                sort={([idA, clubA], [idB, clubB]) => clubA.name.localeCompare(clubB.name)}
                pinned={userData?.clubs ?? []}
            />
        </Header>
    );
}

export default Clubs;
