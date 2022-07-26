import {useContext, useState} from 'react';
import {DateTime} from 'luxon';
import {useScreenType} from '../hooks/useScreenType';

// Components
import HeaderPage from '../components/layout/HeaderPage';
import Search from '../components/layout/Search';
import List from '../components/lists/List';
import StateTab from '../components/layout/StateTab';
import ClubComponent from '../components/lists/ClubComponent';

// Data
import clubs from '@watt/shared/data/clubs';

// Contexts
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext from '../contexts/UserDataContext';


export default function Clubs() {
    const {timestamp, data} = clubs;

    // Dynamically setting default tab
    const currTime = useContext(CurrentTimeContext)
    let date = ((currTime.weekday % 7) + 1).toString();
    if (date > '6') date = '1';

    // Tabs
    const [activeTab, setActiveTab] = useState(date);
    const toggle = (tab: string) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    // User data for pinned
    const userData = useContext(UserDataContext);

    // Screen type for responsive design
    const screenType = useScreenType();
    const shorten = screenType === 'phone';

    // Search
    const [query, setQuery] = useState('');

    // Filtering based on active tab
    const dataFromTab = () => {
        if (activeTab === '1') return data;

        let day = dayFromTabNum(activeTab);
        return Object.entries(data).filter(([name, info]) => info.day.includes(day));
    }

    // Function to get day string from tab number
    // Used to render tab names as well as to filter the displayed JSON
    const dayFromTabNum = (tab: string, shorten?: boolean) => {
        switch (tab) {
            case '1': return 'All';
            case '2': return shorten ? 'Mon' : 'Monday';
            case '3': return shorten ? 'Tues' : 'Tuesday';
            case '4': return shorten ? 'Wed' : 'Wednesday';
            case '5': return shorten ? 'Thur' : 'Thursday';
            case '6': return shorten ? 'Fri' : 'Friday';
        }
        // Hopefully this never triggers!
        return 'Unknown';
    }


    return (
        <HeaderPage
            heading="Clubs"
            other={
                <Search
                    placeholder="Search clubs"
                    onChange={e => setQuery(e.target.value)}
                />
            }
            nav={<>
                <StateTab value="1" name={dayFromTabNum('1', shorten)} state={activeTab} setState={toggle} />
                <StateTab value="2" name={dayFromTabNum('2', shorten)} state={activeTab} setState={toggle} />
                <StateTab value="3" name={dayFromTabNum('3', shorten)} state={activeTab} setState={toggle} />
                <StateTab value="4" name={dayFromTabNum('4', shorten)} state={activeTab} setState={toggle} />
                <StateTab value="5" name={dayFromTabNum('5', shorten)} state={activeTab} setState={toggle} />
                <StateTab value="6" name={dayFromTabNum('6', shorten)} state={activeTab} setState={toggle} />
            </>}
        >
            <p className="mb-4 secondary">
                Please note that club information was taken from{' '}
                <a href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQ-UXugiZ8GznB367cO8JptTO9BLm5OE4D3WO8oZvYk_365lY25Q6eAFNSEIC5DGXGWOXwK_wauoTFT/pubhtml" target="_blank" rel="noopener noreferrer">the 2021-2022 chartered clubs spreadsheet</a>{' '}
                as of {DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_FULL)}. Attribute inaccuracies to them.
            </p>
            <List
                data={dataFromTab()}
                filter={([id, club]) =>
                    query === ''
                    || club.name.toLowerCase().includes(query.toLowerCase())
                    || club.room.toLowerCase().includes(query.toLowerCase())
                    || club.day.toLowerCase().includes(query.toLowerCase())
                }
                map={([id, club]) => (
                    <ClubComponent
                        key={id}
                        id={id}
                        {...club}
                    />
                )}
                sort={([idA, clubA], [idB, clubB]) => clubA.name.localeCompare(clubB.name)}
                pinned={userData.clubs}
            />
        </HeaderPage>
    );
}
