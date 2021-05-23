import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import moment from 'moment';
import {GCalEvent} from './components/schedule/Event';

// Components
import Layout from './components/Layout';
import Home from './views/Home';
import Utilities from './views/Utilities';
import Classes from './views/Classes';
import Clubs from "./views/Clubs";
import Settings from './views/Settings';
import Testing from './views/Testing';
import PageNotFound from './views/404';
import SgyAuthRedirect from './views/SgyAuthRedirect';

// Context
import {UserData, UserDataProvider} from './contexts/UserDataContext';
import {TimeProvider} from './contexts/CurrentTimeContext';

// Firestore
import firebase from './firebase/Firebase';
import {useCollection, useDocument} from 'react-firebase-hooks/firestore';

// Utils
import {parseNextPeriod} from './components/schedule/PeriodIndicator';
import {parsePeriodName} from './components/schedule/Periods';

const calendarAPIKey = 'AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc';


const App = () => {
    // Global datetime
    const [date, setDate] = useState(moment());

    // Set interval on mount to update datetime every second
    useEffect(() => {
        const update = () => setDate(moment());
        const timerID = setInterval(
            () => update(),
            1000
        );

        // Clear interval on unmount
        return function cleanup() {
            clearInterval(timerID);
        }
    }, [])


    // Events data for schedule
    const [events, setEvents] = useState<GCalEvent[] | null>(null);

    // Fetch events on mount
    useEffect(() => {
        const googleCalendarId = encodeURIComponent('fg978mo762lqm6get2ubiab0mk0f6m2c@import.calendar.google.com');
        const target = `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?`
            + `key=${calendarAPIKey}&timeZone=America/Los_Angeles&showDeleted=false&singleEvents=true&orderBy=startTime&`
            + `maxResults=2500&fields=items(description%2Cend(date%2CdateTime)%2Clocation%2Cstart(date%2CdateTime)%2Csummary)`;

        fetch(target)
            .then(res => res.json())
            .then(json => setEvents(json.items));
    }, [])


    // Update document name based on current period
    useEffect(() => {
        const midnight = date.clone().startOf('date');
        const minutes = date.diff(midnight, 'minutes');
        const period = parseNextPeriod(date, minutes);

        if (!period) {
            document.title = 'Web App of The Titans (WATT)';
            return;
        }
        const {next} = period;

        const name = parsePeriodName(next[0], userData?.data() as UserData);
        const startingIn = next[1].s - minutes;
        const endingIn = next[1].e - minutes;

        document.title = (startingIn > 0)
            ? `${name} starting in ${startingIn} minute${startingIn !== 1 ? 's' : ''}.`
            : `${name} ending in ${endingIn} minute${endingIn !== 1 ? 's' : ''}, started ${-startingIn} minute${startingIn !== -1 ? 's' : ''} ago.`
    }, [date])


    // Firestore data
    const firestore = firebase.firestore;
    const auth = firebase.auth;

    const [gunnData, gdLoading, gdError] = useCollection(firestore.collection('gunn'));
    const [userData, udLoading, udError] = useDocument(firestore.doc(`users/${auth.currentUser?.uid}`));

    document.body.className = userData?.data()?.options.theme ?? 'light';

    return (
        <Router>
            <UserDataProvider value={userData?.data() as UserData}>
                <TimeProvider value={date}>
                    <Layout>
                        <Switch>
                            <Route exact path='/' render={() => <Home events={events}/>}/>
                            <Route path='/utilities' component={Utilities}/>
                            <Route path='/classes' component={Classes}/>
                            <Route path='/clubs' component={Clubs}/>
                            <Route path='/settings' component={Settings}/>
                            <Route path='/super-secret-testing' component={Testing} />
                            <Route path='/schoology/auth' component={SgyAuthRedirect} />
                            <Route component={PageNotFound}/>
                            {/* gunnData && console.log(gunnData.docs.map(x => x.data())) */}
                            {/* gunnData && gunnData.forEach(e => console.log(e.data())) */}
                            {/* userData && console.log(userData.data()) */}
                        </Switch>
                    </Layout>
                </TimeProvider>
            </UserDataProvider>
        </Router>
    );
}

export default App;
