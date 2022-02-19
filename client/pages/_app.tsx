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
import {fbconfig} from '../firebase/config';

// Contexts
import CombinedUserDataProvider from '../components/firebase/CombinedUserDataProvider';
import {TimeProvider} from '../contexts/CurrentTimeContext';
import {EventsProvider, GCalEvent} from '../contexts/EventsContext';

import 'bootstrap/dist/css/bootstrap.css';
import '../scss/index.scss';

const calendarAPIKey = 'AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc';


export default function App({ Component, pageProps }: AppProps) {
    // Global datetime
    const [date, setDate] = useState(moment());

    useEffect(() => {
        const update = () => setDate(moment());
        const timerID = setInterval(update, 1000);

        // Clear interval on unmount
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
        <FirebaseAppProvider firebaseConfig={fbconfig}>
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
