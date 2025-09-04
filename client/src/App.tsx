import {useContext, useEffect, useState, lazy, Suspense} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import {useAnalytics, useAuth, useFirestore, useSigninCheck} from 'reactfire';
import {DateTime} from 'luxon';
import PageVisibility from 'react-page-visibility';
import {GCalEvent} from './components/schedule/Event';

// Layouts
import AppLayout from './components/layout/AppLayout';
import ResourcesLayout from './components/resources/ResourcesLayout';
import UtilitiesLayout from './components/utilities/UtilitiesLayout';
import SettingsLayout from './components/settings/SettingsLayout';
import ClassesLayout from './components/classes/ClassesLayout';

// Pages
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import Barcode from './pages/utilities/Barcode';
import Map from './pages/utilities/Map';
import Calculator from './pages/utilities/Calculator';
import Staff from './pages/utilities/Staff';
import Courses from './pages/utilities/Courses';
import Wellness from './pages/utilities/Wellness';
import Resources from './pages/utilities/Resources';
import Appearance from './pages/settings/Appearance';
import Features from './pages/settings/Features';
import PeriodCustomization from './pages/settings/PeriodCustomization';
import About from './pages/settings/About';
import Dashboard from './pages/classes/Dashboard';
import Upcoming from './pages/classes/Upcoming';
import Materials from './pages/classes/Materials';
import PageNotFound from './pages/404';
import SgyAuthRedirect from './pages/SgyAuthRedirect';

// Components
import FaviconHandler from './components/schedule/FaviconHandler';
import InstallModal from './components/layout/InstallModal';
import SgyInitResults from './components/firebase/SgyInitResults';
import FirebaseUserDataUpdater from './components/firebase/FirebaseUserDataUpdater';

// Contexts
import {AlternatesProvider} from './contexts/AlternatesContext';
import {TimeProvider} from './contexts/CurrentTimeContext';
import {UserDataProvider} from './contexts/UserDataContext';

// Utils
import {logEvent} from 'firebase/analytics';
import {getRedirectResult} from 'firebase/auth';
import {useAlternates} from './hooks/useAlternates';
import {useLocalStorageData} from './hooks/useLocalStorageData';
import {firestoreInit} from './util/firestore';

// Lazy-loaded pages
const Testing = lazy(() => import('./pages/Testing'));
const NYTimes = lazy(() => import('./components/resources/NYTimes'));
const Adobe = lazy(() => import('./components/resources/Adobe'));
const LibraryCard = lazy(() => import('./components/resources/LibraryCard'));


const calendarAPIKey = 'AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc';

export default function App() {
    const userData = useLocalStorageData();
    const { data: signInCheckResult } = useSigninCheck();

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

        const googleCalendarId = encodeURIComponent('q9kqcck6r07ut3mv276tovjp1d5kj03a@import.calendar.google.com');
        const target = `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?`
            + `key=${calendarAPIKey}&timeZone=America/Los_Angeles&showDeleted=false&singleEvents=true&orderBy=startTime&`
            + `maxResults=2500&fields=items(description%2Cend(date%2CdateTime)%2Clocation%2Cstart(date%2CdateTime)%2Csummary)`;

        fetch(target)
            .then(res => res.json())
            .then(json => setEvents(json.items))
            .catch(setEventsError)
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
        <UserDataProvider value={userData}>
            <AlternatesProvider value={alternates}>
                <TimeProvider value={date}>
                    <PageVisibility onChange={() => navigator.serviceWorker.getRegistration().then(res => res?.update())} />
                    <FaviconHandler />
                    {signInCheckResult?.signedIn && <FirebaseUserDataUpdater />}

                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route path="/" element={<Home events={events} eventsError={eventsError} fetchEvents={fetchEvents} />}/>
                            <Route path="/classes" element={<ClassesLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="upcoming" element={<Upcoming />} />
                                <Route path="materials" element={<Materials />} />
                            </Route>
                            <Route path="/clubs" element={<Clubs />} />
                            <Route path="/utilities" element={<UtilitiesLayout />}>
                                <Route index element={<Barcode />} />
                                {/* <Route path="graphing`} element={<GraphingCalculator />}/> */}
                                <Route path="map" element={<Map />} />
                                <Route path="calculator" element={<Calculator />} />
                                <Route path="staff" element={<Staff />} />
                                <Route path="courses" element={<Courses />} />
                                <Route path="wellness" element={<Wellness />} />
                                <Route path="resources" element={<Resources />} />
                            </Route>
                            <Route path="/settings" element={<SettingsLayout />}>
                                <Route index element={<Appearance />} />
                                <Route path="features" element={<Features />} />
                                <Route path="periods" element={<PeriodCustomization />} />
                                <Route path="about" element={<About />} />
                            </Route>
                        </Route>
                        <Route path="/resources" element={<ResourcesLayout />}>
                            <Route path="nytimes" element={<NYTimes />} />
                            <Route path="adobe" element={<Adobe />} />
                            <Route path="library-card" element={<LibraryCard />} />
                        </Route>
                        <Route
                            path="/super-secret-testing"
                            element={<Suspense><Testing /></Suspense>}
                        />
                        <Route path="/schoology/auth" element={<SgyAuthRedirect />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>

                    <InstallModal />
                    <SgyInitResults />
                </TimeProvider>
            </AlternatesProvider>
        </UserDataProvider>
    );
}
