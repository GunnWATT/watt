import {ReactNode, useContext, useEffect, useState} from 'react';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import {FirebaseAppProvider, useAnalytics, useAuth, useFirestore, useSigninCheck} from 'reactfire';
import {DateTime} from 'luxon';
import PageVisibility from 'react-page-visibility';
import {GCalEvent} from '../components/schedule/Event';

// Components
import FirebaseProviders from '../components/firebase/FirebaseProviders';
import UserDataProvider from '../components/firebase/UserDataProvider';
import FaviconHandler from '../components/schedule/FaviconHandler';
import InstallModal from '../components/layout/InstallModal';
import SgyInitResults from '../components/firebase/SgyInitResults';

// Contexts
import {AlternatesProvider} from '../contexts/AlternatesContext';
import {TimeProvider} from '../contexts/CurrentTimeContext';
import UserDataContext from '../contexts/UserDataContext';

// Utils
import {logEvent} from 'firebase/analytics';
import {getRedirectResult} from 'firebase/auth';
import {firestoreInit} from '../util/firestore';
import {useAlternates} from '../hooks/useAlternates';

import '../styles/base.scss';
import '../styles/tailwind.scss';


const firebaseConfig = {
    apiKey: 'AIzaSyAjmAlzXLNelfL4Ak7dMPXWg8-3wLcCwpY',
    authDomain: 'gunnwatt.firebaseapp.com',
    databaseURL: 'https://gunnwatt.firebaseio.com',
    projectId: 'gunnwatt',
    storageBucket: 'gunnwatt.appspot.com',
    messagingSenderId: '108805079121',
    appId: '1:108805079121:web:b08582f4c5c13763fb7870',
    measurementId: 'G-8EVM6G2Z8X'
}

const calendarAPIKey = 'AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc';

export default function App({ Component, pageProps }: AppProps) {
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

    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <FirebaseProviders>
                <UserDataProvider>
                    <NestedProviders>
                        <TimeProvider value={date}>
                            <PageVisibility onChange={() => navigator.serviceWorker.getRegistration().then(res => res?.update())} />
                            <FaviconHandler />

                            <Component {...pageProps} />

                            <InstallModal />
                            <SgyInitResults />
                        </TimeProvider>
                    </NestedProviders>
                </UserDataProvider>
            </FirebaseProviders>
        </FirebaseAppProvider>
    );
}

function NestedProviders(props: {children: ReactNode}) {
    // Log every route change for analytics
    const router = useRouter();
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
    const userData = useContext(UserDataContext);
    useEffect(() => {
        document.documentElement.className = userData.options.theme;
    }, [userData.options.theme])

    // Global alternates
    const alternates = useAlternates();

    return (
        <AlternatesProvider value={alternates}>
            {props.children}
        </AlternatesProvider>
    )
}

/*
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
            <Route path="map" element={<Map />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="staff" element={<Staff />} />
            <Route path="courses" element={<WIP />} />
            <Route path="resources" element={<Resources />} />
        </Route>
        <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Appearance />} />
            <Route path="features" element={<Features />} />
            <Route path="periods" element={<PeriodCustomization />} />
            <Route path="about" element={<About />} />
        </Route>
        <Route
            path="/super-secret-testing"
            element={<Suspense><Testing /></Suspense>}
        />
    </Route>
    <Route path="/resources" element={<ResourcesLayout />}>
        <Route path="nytimes" element={<NYTimes />} />
        <Route path="support" element={<Support />} />
    </Route>
    <Route path="/schoology/auth" element={<SgyAuthRedirect />}/>
    <Route path="*" element={<PageNotFound />}/>
</Routes>
 */
