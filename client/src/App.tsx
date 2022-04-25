import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useAuth, useSigninCheck} from 'reactfire';
import {DateTime} from 'luxon';
import PageVisibility from 'react-page-visibility';
import {GCalEvent} from './components/schedule/Event';

// Components
import Layout from './components/Layout';
import Home from './pages/Home';
import Utilities from './pages/Utilities';
import Classes from './pages/Classes';
import Clubs from './pages/Clubs';
import Settings from './pages/Settings';
import Testing from './pages/Testing';
import PageNotFound from './pages/404';
import SgyAuthRedirect from './pages/SgyAuthRedirect';
import FaviconHandler from './components/schedule/FaviconHandler';
import InstallModal from './components/layout/InstallModal';
import FirebaseUserDataProvider from './components/firebase/FirebaseUserDataProvider';
import LocalStorageUserDataProvider from './components/firebase/LocalStorageUserDataProvider';

// Context
import {TimeProvider} from './contexts/CurrentTimeContext';


const calendarAPIKey = 'AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc';

export default function App() {
    // Global datetime
    const [date, setDate] = useState(DateTime.now());

    useEffect(() => {
        const timerID = setInterval(() => setDate(DateTime.now()), 1000);
        return () => clearInterval(timerID);
    }, []);

    // Events data for schedule
    const [events, setEvents] = useState<GCalEvent[] | null>(null);
    const [eventsError, setEventsError] = useState<Error | null>(null)

    const fetchEvents = () => {
        setEventsError(null);

        const googleCalendarId = encodeURIComponent('fg978mo762lqm6get2ubiab0mk0f6m2c@import.calendar.google.com');
        const target = `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?`
            + `key=${calendarAPIKey}&timeZone=America/Los_Angeles&showDeleted=false&singleEvents=true&orderBy=startTime&`
            + `maxResults=2500&fields=items(description%2Cend(date%2CdateTime)%2Clocation%2Cstart(date%2CdateTime)%2Csummary)`;

        fetch(target)
            .then(res => res.json())
            .then(json => setEvents(json.items))
            .catch(err => setEventsError(err))
    }

    // Fetch events on mount
    useEffect(fetchEvents, []);

    const { data: signInCheckResult } = useSigninCheck()
    const UserDataProvider = signInCheckResult?.signedIn ? FirebaseUserDataProvider : LocalStorageUserDataProvider;

    return (
        <Router>
            <PageVisibility onChange={() => navigator.serviceWorker.getRegistration().then(res => res?.update())} />
            <UserDataProvider>
                <TimeProvider value={date}>
                    <FaviconHandler />
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home events={events} eventsError={eventsError} fetchEvents={fetchEvents} />}/>
                            <Route path="/classes/*" element={<Classes />}/>
                            <Route path="/clubs" element={<Clubs />}/>
                            <Route path="/utilities/*" element={<Utilities />}/>
                            <Route path="/settings/*" element={<Settings />}/>
                            <Route path="/super-secret-testing" element={<Testing />}/>
                            <Route path="/schoology/auth" element={<SgyAuthRedirect />}/>
                            <Route path="*" element={<PageNotFound />}/>
                        </Routes>
                    </Layout>
                    <InstallModal />
                </TimeProvider>
            </UserDataProvider>
        </Router>
    );
}
