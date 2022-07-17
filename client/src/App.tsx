import {useContext, useEffect, useState} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import {useAnalytics, useAuth, useFirestore, useSigninCheck} from 'reactfire';
import {DateTime} from 'luxon';
import PageVisibility from 'react-page-visibility';
import {GCalEvent} from './components/schedule/Event';

// Components
import AppLayout from './components/layout/AppLayout';
import ResourcesLayout from './components/layout/ResourcesLayout';
import Home from './pages/Home';
import Utilities from './pages/Utilities';
import Classes from './pages/Classes';
import Clubs from './pages/Clubs';
import Settings from './pages/Settings';
import Testing from './pages/Testing';
import PageNotFound from './pages/404';
import SgyAuthRedirect from './pages/SgyAuthRedirect';
import Barcode from './components/utilities/Barcode';
import Map from './components/utilities/Map';
import Calculator from './components/utilities/Calculator';
import Staff from './components/lists/Staff';
import WIP from './components/layout/WIP';
import Resources from './components/utilities/Resources';
import Appearance from './components/settings/Appearance';
import Features from './components/settings/Features';
import PeriodCustomization from './components/settings/PeriodCustomization';
import About from './components/settings/About';
import Dashboard from './components/classes/Dashboard';
import Upcoming from './components/classes/Upcoming';
import Materials from './components/classes/Materials';
import NYTimes from './components/utilities/NYTimes';
import Support from './components/utilities/Support';
import FaviconHandler from './components/schedule/FaviconHandler';
import InstallModal from './components/layout/InstallModal';
import SgyInitResults from './components/firebase/SgyInitResults';

// Contexts
import {AlternatesProvider} from './contexts/AlternatesContext';
import {TimeProvider} from './contexts/CurrentTimeContext';
import UserDataContext from './contexts/UserDataContext';

// Utils
import {logEvent} from 'firebase/analytics';
import {getRedirectResult} from 'firebase/auth';
import {firestoreInit} from './util/firestore';
import {useAlternates} from './hooks/useAlternates';


const calendarAPIKey = 'AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc';

export default function App() {
    const userData = useContext(UserDataContext);

    // Global datetime
    const [date, setDate] = useState(DateTime.now());

    useEffect(() => {
        const timerID = setInterval(() => setDate(DateTime.now()), 1000);
        return () => clearInterval(timerID);
    }, []);

    // Global alternates
    const alternates = useAlternates();

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

    // Log every route change for analytics
    const location = useLocation();
    const analytics = useAnalytics();
    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: location.pathname,
            firebase_screen_class: location.pathname
        });
    }, [location]);

    // Create user document on first sign in
    const auth = useAuth();
    const firestore = useFirestore();
    useEffect(() => {
        getRedirectResult(auth).then(r => r && firestoreInit(firestore, r, userData))
    }, [])

    // Change theme on userData change
    useEffect(() => {
        document.documentElement.className = userData.options.theme;
    }, [userData.options.theme])

    return (
        <AlternatesProvider value={alternates}>
            <TimeProvider value={date}>
                <PageVisibility onChange={() => navigator.serviceWorker.getRegistration().then(res => res?.update())} />
                <FaviconHandler />

                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Home events={events} eventsError={eventsError} fetchEvents={fetchEvents} />}/>
                        <Route path="/classes" element={<Classes />}>
                            <Route index element={<Dashboard />} />
                            <Route path="upcoming" element={<Upcoming />} />
                            <Route path="materials" element={<Materials />} />
                        </Route>
                        <Route path="/clubs" element={<Clubs />} />
                        <Route path="/utilities" element={<Utilities />}>
                            <Route index element={<Barcode />} />
                            {/* <Route path="graphing`} element={<GraphingCalculator />}/> */}
                            <Route path="map" element={<Map />} />
                            <Route path="calculator" element={<Calculator />} />
                            <Route path="staff" element={<Staff />} />
                            <Route path="courses" element={<WIP />} /> {/* WIP is temporary, will replace with courses when it's finished */}
                            <Route path="resources" element={<Resources />} />
                        </Route>
                        <Route path="/settings" element={<Settings />}>
                            <Route index element={<Appearance />} />
                            <Route path="features" element={<Features />} />
                            <Route path="periods" element={<PeriodCustomization />} />
                            <Route path="about" element={<About />} />
                        </Route>
                        <Route path="/super-secret-testing" element={<Testing />} />
                    </Route>
                    <Route path="/resources" element={<ResourcesLayout />}>
                        <Route path="nytimes" element={<NYTimes />} />
                        <Route path="support" element={<Support />} />
                    </Route>
                    <Route path="/schoology/auth" element={<SgyAuthRedirect />}/>
                    <Route path="*" element={<PageNotFound />}/>
                </Routes>

                <InstallModal />
                <SgyInitResults />
            </TimeProvider>
        </AlternatesProvider>
    );
}
