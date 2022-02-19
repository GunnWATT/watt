import {useEffect, useState} from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import PageVisibility from 'react-page-visibility';
import moment from 'moment';

// Components
import Layout from '../components/Layout';
import FaviconHandler from '../components/schedule/FaviconHandler';

// Firebase
import {FirebaseAppProvider} from 'reactfire';
import FirebaseProviders from '../components/firebase/FirebaseProviders';

// Contexts
import CombinedUserDataProvider from '../components/firebase/CombinedUserDataProvider';
import {TimeProvider} from '../contexts/CurrentTimeContext';
import {EventsProvider, GCalEvent} from '../contexts/EventsContext';

import 'bootstrap/dist/css/bootstrap.css';
import '../scss/index.scss';


const calendarAPIKey = 'AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc';
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

export default function App({ Component, pageProps }: AppProps) {
    // Global datetime
    const [date, setDate] = useState(moment());

    useEffect(() => {
        const timerID = setInterval(() => setDate(moment()), 1000);
        return () => clearInterval(timerID);
    }, []);

    // Google calendar events
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
                <CombinedUserDataProvider>
                <TimeProvider value={date}>
                <EventsProvider value={{events, eventsError, fetchEvents}}>
                    <Head>
                        <title>Web App of The Titans (WATT)</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                    </Head>

                    <PageVisibility onChange={() => navigator.serviceWorker.getRegistration().then(res => res?.update())} />
                    <FaviconHandler />

                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </EventsProvider>
                </TimeProvider>
                </CombinedUserDataProvider>
            </FirebaseProviders>
        </FirebaseAppProvider>
    );
}
